const db = require("../model");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
    //check username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if(err){
            res.status(500).send({
                code: 500,
                message: err
            });
            return;
        }

        if(user){
            res.status(400).send({
                code: 400,
                message: "Failed! Username is already in use!"
            });
            return;
        }

        //check email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if(err){
                res.status(500).send({
                    code: 500,
                    message: err
                });
                return;
            }
            
            if(user){
                res.status(400).send({
                    code: 400,
                    message: "Failed! Email is already in use"
                });
                return;
            }

            next();
        });
    });
};

const checkRolesExisted = (req, res, next) => {
    if(req.body.roles){
        for(let i = 0; i< req.body.roles.length; i++){
            if(!ROLES.includes(req.body.roles[i])){
                res.status(400).send({
                    code: 400,
                    message:  `Failed! Role ${req.body.roles[i]} does not exist!`
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;