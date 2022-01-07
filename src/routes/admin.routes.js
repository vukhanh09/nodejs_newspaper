const { authJwt } = require("../middleware");
const controller = require("../controller/admin.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/admin/find-user", controller.findUser);
};
