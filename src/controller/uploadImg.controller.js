const httpStatus = require("../utils/httpStatus");
const uploadImgController = {};
const {url} = require('../config/urlStorage.config')

uploadImgController.uploadFile = async (req, res, next) => {
    const file = req.file;
    // Kiểm tra nếu không phải dạng file thì báo lỗi
    if (!file) {
        const error = new Error('Upload file again!')
        error.httpStatusCode = 400
        return next(error)
      }
    // file đã được lưu vào thư mục uploads
    // gọi tên file: req.file.filename và render ra màn hình

    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "get all topic successfully!",
      data: `/${req.file.filename}`,
    });

}

module.exports = uploadImgController;