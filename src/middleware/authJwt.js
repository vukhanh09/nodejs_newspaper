const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../model");
const User = db.user;
const Role = db.role;

const { TokenExpiredError } = jwt;


const CatchExpiredTokenError = (err, res) => {
    if(err instanceof TokenExpiredError){
        return res.status(401).send({
            code: 401,
            message: "Unauthorized! Access token was expired"
        });
    }
    return res.status(401).send({
        code:401,
        message: "Unauthorized!"
    });
}

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).send({
            code: 403,
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
            return CatchExpiredTokenError(err, res);
        }
        req.userId = decoded.id;
        next();
    });
}

const isAdmin = (req,res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if(err){
            res.status(500).send({
                code: 500,
                message: err
            });
            return;
        }

        Role.find(
            {
                _id: { $in: user.roles}
            },
            (err, roles) => {
                if(err){
                    res.status(500).send({
                        code: 500,
                        message: err
                    });
                    return;
                }

                for(let i = 0; i < roles.length; i++){
                    if(roles[i].name === "ADMIN"){
                        next();
                        return;
                    }
                }
                res.status(403).send({
                    code: 403,
                    message: "Require ADMIN role!"
                });
                return;
            }
        );
    });
};

const authJwt = {
    verifyToken,
    isAdmin
};

module.exports = authJwt;
