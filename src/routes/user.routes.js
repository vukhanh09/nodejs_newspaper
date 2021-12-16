const { authJwt } = require("../middleware");
const controller = require("../controller/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/users/change-password", [authJwt.verifyToken], controller.changePassword);

  app.get("/api/users/get-user-info",[authJwt.verifyToken], controller.getUserInfo);

  app.post("/api/users/update-user-info", [authJwt.verifyToken], controller.updateUserInfo);

  app.get("/api/users/get-list-users",[authJwt.verifyToken, authJwt.isAdmin], controller.getListUsers);
};
