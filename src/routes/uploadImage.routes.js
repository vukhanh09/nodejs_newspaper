const uploadImgController = require("../controller/uploadImg.controller")
const multer = require('multer');
const {storage} = require("../middleware/storageImg")

module.exports = function(app) {
    const upload = multer({ storage: storage })
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
    app.post("/api/uploadFile/",upload.single('formFile'), uploadImgController.uploadFile);
  };