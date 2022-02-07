const db = require("../model");
const httpStatus = require("../utils/httpStatus");
const News = db.news;
const newsController = {};
const currentDay = new Date().toLocaleDateString();

//get news by news_id
newsController.getNewsById = async (req, res, next) => {
  try {
    let newsId = req.query.news_id;
    console.log(newsId);
    const news = await News.findOne({
      news_id: newsId
    });
    if (!news) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "News not found!",
      });
    }
    // console.log("news by id", news);
    let currentViews = news.views;
    // console.log(currentViews);
    await News.updateOne({news_id: newsId},{
      views: currentViews + 1
    });
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "get news by news_id successfully!",
      data: news,
    });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

//get hot news
newsController.getHotNews = async (req, res, next) => {
  try {
    let hotNews = await News.find().sort({ views: -1 }).limit(1);
    if (!hotNews) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "Collection is empty!",
      });
    }
    console.log(hotNews);
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "get hot news successfully!",
      data: hotNews,
    });
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

//get hot topic
newsController.getHotNewsByTopic = async (req, res, next) => {
  try{
    const topicNames= ["Du lịch", "Kinh doanh", "Thời sự", "Thế giới"];
    let rsNews = [];
    for(let i = 0; i< topicNames.length; i++){
      let news = await News.find({topic: topicNames[i]}).sort({views: -1}).limit(1);
      rsNews.push(news[0]);
    }
    if(!rsNews){
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "Topic is not exist or don\' have a news satisfy!"
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "get hot news by topic successfully!",
      data: rsNews
    });
  }catch(err){
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

//get the top 10 most viewed news
newsController.getTop10News = async (req, res, next) => {
  try {
    let hotNews = await News.find().sort({ views: -1 }).limit(10);
    if (!hotNews) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "Collection is empty!",
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "get top 10 hot news successfully!",
      data: hotNews,
    });
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

//The last 3 news added
newsController.get3LastAddedNews = async (req, res, next) => {
  try {
    let hotNews = await News.find().sort({ add_time: -1 }).limit(3);
    if (!hotNews) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "Collection is empty!",
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "get the last 3 news added successfully!",
      data: hotNews,
    });
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
}

//The last 3 news added
newsController.get3LastAddedNewsOfTopic = async (req, res, next) => {
  try {
    let topic = req.query.topic;
    let hotNews = await News.find({topic: topic}).sort({ add_time: -1 }).limit(3);
    if (!hotNews) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "Collection is empty!",
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: `get the last 3 news added of topic ${topic} successfully!`,
      data: hotNews,
    });
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
}

//get top3 news of a topic
newsController.getTop3NewsOfTopic = async (req, res, next) => {
  try {
    let topic = req.query.topic;
    let hotNews = await News.find({topic: topic}).sort({ views: -1 }).limit(3);
    if (!hotNews) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "Collection is empty!",
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: `get top 3 hot news of topic ${topic}`,
      data: hotNews,
    });
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
}

//add news: ADMIN -> require admin role
newsController.addNews = async (req, res, next) => {
  try {
    // console.log(req.body)
    let newsToAdd = {
      title: req.body.title,
      content: req.body.content,
      url_image: req.body.url_image,
      description: req.body.description,
      extend_description: req.body.extend_description,
      topic: req.body.topic,
      author:req.body.author,
      add_time: currentDay,
      last_modify: currentDay
    };
    let lastNews = await News.find().sort({ news_id: -1 }).limit(1);
    if (!lastNews) {
      newsToAdd.url = getUrlFromTitleAndId(newsToAdd.title, 1);
    } else {
      newsToAdd.news_id = lastNews[0].news_id + 1;
      newsToAdd.url = getUrlFromTitleAndId(newsToAdd.title, newsToAdd.news_id);
      newsToAdd.views = 0;
    }
    if(newsToAdd.url == null){
      return res.status(httpStatus.BAD_REQUEST).send({
        code: httpStatus.BAD_REQUEST,
        message: "failed to create URL!"
      });
    }
    console.log(newsToAdd);
    News.insertMany(newsToAdd);
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "insert successfully",
      data: newsToAdd,
    });
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};
/**
 * create url from title and id of news
 * @param {String} title
 * @param {*} id
 * @returns
 */
function getUrlFromTitleAndId(title, id) {
  if (title == null) {
    return null;
  }
  title = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  let listWords = title
    .replace("'", "")
    .replace('"', "")
    .replace("?", "")
    .replace("!", "")
    .replace(".", "")
    .replace(",", "")
    .replace("/", "-")
    .split(" ");
  let rs = "";
  for (let str in listWords) {
    rs += listWords[str] + "-";
  }
  rs += id + ".html";
  return rs;
}

//get views of news
newsController.countViews = async (req, res, next) => {
  try{
    let newsId = req.query.news_id;
    const news = await News.findOne({
      news_id: newsId,
    });

    if (!news) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "News not found!",
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "count views by news_id successfully!",
      data: {
        numberViews: news.views
      },
    });
  }catch(err){
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
}

// get all news

newsController.getAllNews = async (req, res, next) => {
  try{
    const news = await News.find();
    if (!news) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "News not found!",
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "get all list news successfully!",
      data: {
        listNews: news
      },
    });
  }
  catch(err){
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });

  }
}

newsController.getNewsByTopicAndTitle = async (req, res, next) => {
  try{
    // console.log(req.query)
    const topicNeed = req.query.topic
    const titleNeed = req.query.title
    var news;
    // console.log(titleNeed)
    if(!titleNeed.length){
      news = await News.find({topic:topicNeed});
    }
    else if(!topicNeed.length){
      const regParm = { $regex: titleNeed, $options: 'i' }
      news = await News.find({ title: regParm }).exec();
    }
    else if(titleNeed.length && topicNeed.length ){
      const regParm = { $regex: titleNeed, $options: 'i' }
      news = await News.find({
        $and: [
          { title: regParm },
          {topic:topicNeed}
        ]
      }).exec();


    }
    if (!news || news.length==0) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "News not found!",
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "get all list news by topic successfully!",
      data: {
        listNews: news
      },
    });
  }
  catch(err){
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });

  }
}

//update news by news_id => require ADMIN role
newsController.updateNews = async (req, res, next) => {
  try{
    let data = req.body.data
    const news_id = req.body.news_id.news_id

    await News.updateOne({news_id:news_id},{
      title:data.title,
      content:data.content,
      author:data.author,
      url_image:data.url_image,
      description:data.description,
      extend_description:data.extend_description,
      topic:data.topic,
      last_modify: currentDay
    })
    // console.log(resUp.n)
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "update news successfully!"
    });
  }
  catch(err){
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });

  }
}

//delete news by news_id => require ADMIN role
newsController.deleteNews = async (req, res, next) => {
  try{
    // console.log(req)
    let news_id = req.body.news_id
    // console.log(news_id)
    const rsNews = await News.find({news_id: news_id});
    if(rsNews.length == 0){
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "News not found!",
      });
    }
    await News.deleteOne({news_id: news_id});
    // console.log('done')
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "Delete news successfully!",
    });

  }catch(err){
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
}

//couht number of new news today => require ADMIN role
newsController.countNewNewsInDay = async (req, res, next) => {
  try{
    const countNews = await News.find({add_time: currentDay})
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "count successfully!",
      data: {counts: countNews.length}
    });
  }catch(err){
    console.log(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
}

//top 4 news in tourism topic
newsController.getTop4InTourism = async (req, res, next) => {
  try{
    let hotNews = await News.find({topic: 'Du lịch'}).sort({ views: -1 }).limit(4);
    if (!hotNews) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "Collection is empty!",
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: `get top 4 hot news of tourism successfully`,
      data: hotNews,
    });
  }catch(err){
    console.log(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
} 

// get hot news of each topic 
newsController.getHotNewsOfEachTopic = async (req, res, next) => {
  try{
    let topic = req.query.topic;
    let hotNews = await News.find({topic: topic}).sort({views : -1}).limit(1)
    if (!hotNews) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "Collection is empty!",
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: `get hot news of topic ${topic} successfully!`,
      data: hotNews[0],
    });
  }catch(err){
    console.log(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
}

//get top4 newest news in each topic
newsController.getTop4NewestNewsOfEachTopic = async (req, res, next) => {
  try{
    let topic = req.query.topic;
    let hotNews = await News.find({topic: topic}).sort({add_time : -1}).limit(9)
    if (!hotNews) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "Collection is empty!",
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: `get top 4 newest news of topic ${topic} successfully!`,
      data: hotNews,
    });
  }catch(err){
    console.log(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
}

module.exports = newsController;
