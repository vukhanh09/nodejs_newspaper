const db = require("../model");
const httpStatus = require("../utils/httpStatus");
const News = db.news;
const newsController = {};

newsController.getNewsById = async (req, res, next) => {
  try {
    let newsId = req.body.newsId;
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
    let hotNews = await News.find().sort({views: -1}).limit(1);
    if(!hotNews){
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "Collection is empty!"
      });
    }
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
  
};

//get the top 10 most viewed news
newsController.getTop10News = async (req, res, next) => {
  try {
    let hotNews = await News.find().sort({views: -1}).limit(10);
    if(!hotNews){
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "Collection is empty!"
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
module.exports = newsController;
