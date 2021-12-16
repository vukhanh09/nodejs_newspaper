const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../model");
const User = db.user;
const httpStatus = require("../utils/httpStatus");
const userController = {};

userController.changePassword = async (req, res, next) => {
  try {
    let userId = req.userId;
    let user = await User.findById(userId);
    if (user == null) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        code: httpStatus.UNAUTHORIZED,
        message: "Unauthorized",
      });
    }

    const { currentPassword, newPassword } = req.body;
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(httpStatus.BAD_REQUEST).send({
        code: httpStatus.BAD_REQUEST,
        message: "Current password incorrect",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user = await User.findOneAndUpdate(
      { _id: userId },
      {
        password: hashedNewPassword,
      }
    );

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    //create and assign a token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        address: user.address,
      },
      config.secret,
      {
        expiresIn: 86400, //24 hours
      }
    );

    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "Change password successfully!",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        address: user.address,
        accessToken: token,
      },
    });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};
userController.getUserInfo = async (req, res, next) => {
  try {
    let userId = req.userId;
    let user = await User.findById(userId);
    if (user == null) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        code: httpStatus.UNAUTHORIZED,
        message: "Unauthorized",
      });
    }
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "get user information successfully!",
      data: {
        id: userId,
        username: user.username,
        email: user.email,
        address: user.address,
      },
    });
    return;
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

userController.updateUserInfo = async (req, res, next) => {
  try {
    let userId = req.userId;
    let user = await User.findById(userId);
    if (user == null) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        code: httpStatus.UNAUTHORIZED,
        message: "Unauthorized",
      });
    }
    const { newAddress } = req.body;
    user = await User.findOneAndUpdate(
      {_id: userId},
      {
        address: newAddress
      }
    );
    if(!user){
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: "user not found!"
      })
    }
    user = await User.findById(userId).select('username email address');
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "update user information successfully!",
      data: {
        id: userId,
        username: user.username,
        email: user.email,
        address: user.address
      }
    });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

userController.getListUsers = async (req, res, next) => {
  try{
    const listUsers = await User.find();
    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "get all user succesfully!",
      data: listUsers
    })
  }catch{
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
}
module.exports = userController;
