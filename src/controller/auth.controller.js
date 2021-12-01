const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../model");
const { authJwt } = require("../middleware");
const User = db.user;
const Role = db.role;

//signup controller
exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,8),
        address: req.body.address
    });

    user.save((err, user) => {
        if(err){
            res.status(500).send({
                code: 500,
                message: err
            });
            return;
        }

        Role.findOne({name: "USER"}, (err, role) => {
            if(err){
                res.status(500).send({
                    code: 500,
                    message: err
                });
                return;
            }

            user.roles = [role._id];
            user.save(err => {
                if(err){
                    res.status(500).send({
                        code: 500,
                        message: err
                    });
                    return;
                }
                console.log("registrations info: ", user);
                res.send({
                    code: 201,
                    message: "User was registered successfully!"
                });
            });
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
    .populate("roles","-__v")
    .exec((err, user) => {
        if(err) {
            res.status(500).send({
                code: 500,
                message: err
            });
            return;
        }
        if(!user){
            return res.status(404).send({
                code: 404,
                message: "User not found!"
            });
        }
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordIsValid){
            return res.status(401).send({
                code: 401,
                message: "Invalid Password!",
                data: {
                    accessToken: null
                }
            })
        }

        var token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            address: user.address
        }, config.secret, {
            expiresIn: 86400 //24 hours
        });

        var authorities = [];

        for(let i = 0; i< user.roles.length; i++){
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        console.log("login info: ",user)
        res.status(200).send({
            code: 200,
            message: "Login successfully!",
            data: {
                username: user.username,
                email: user.email,
                address: user.address,
                accessToken: token 
            }
        });
        
    });
};
