const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../model");
const User = db.user;
const httpStatus = require("../utils/httpStatus");
const userController = {};

userController.findUser = async (req, res, next) => {
    try{
        const username = req.query.username;
        const regUserName = {$regex: username, $options: 'i'}
        const nick_name = req.query.fullname;
        const regNickName = {$regex: nick_name, $options: 'i'}

        const listUser = await User.find({ $or:[
            {username: regUserName},
            {nick_name:regNickName}
        ]}).exec();

        if (!listUser) {
            return res.status(httpStatus.NOT_FOUND).send({
              code: httpStatus.NOT_FOUND,
              message: "News not found!",
            });
          }
        return res.status(httpStatus.OK).send({
            code: httpStatus.OK,
            message: "get news by news_id successfully!",
            data: listUser,
        });



    }
    catch(err){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            code: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message,
        });

    }
}

module.exports = userController;