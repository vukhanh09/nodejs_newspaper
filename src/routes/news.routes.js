const controller = require("../controller/news.controller")
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });  
    app.get("/api/news/get-news-by-id", controller.getNewsById);
    app.get("/api/news/get-views-by-id", controller.countViews);
    app.get("/api/news/get-hot-news", controller.getHotNews);
    app.get("/api/news/get-hot-news-by-topic", controller.getHotNewsByTopic);
    app.get("/api/news/get-top10-hot-news", controller.getTop10News);
    app.get("/api/news/get-3-newest-news", controller.get3LastAddedNews);
    app.get("/api/news/get-3-newest-news-topic", controller.get3LastAddedNewsOfTopic);
    app.get("/api/news/get-top3-news-topic", controller.getTop3NewsOfTopic);
    app.post("/api/news/add-news", controller.addNews);
    app.get("/api/news/get-all-news", controller.getAllNews);
    app.get("/api/news/get-news-by-topic", controller.getNewsByTopicAndTitle);
    app.post("/api/news/update-news",[authJwt.verifyToken, authJwt.isAdmin], controller.updateNews);
    app.delete("/api/news/delete-news",[authJwt.verifyToken, authJwt.isAdmin], controller.deleteNews);
    app.get("/api/news/count-news-today",[authJwt.verifyToken, authJwt.isAdmin], controller.countNewNewsInDay);
    app.get("/api/news/get-top4-tourism", controller.getTop4InTourism);
    app.get("/api/news/get-hot-news-each-topic", controller.getHotNewsOfEachTopic);
    app.get("/api/news/get-top4-newest-news-each-topic", controller.getTop4NewestNewsOfEachTopic)
  };