const jwt = require("jsonwebtoken");
const ONE_WEEK = 60 * 60 * 24 * 7;
const { users } = require("../models");
//jwt config
const jwtSecret = "*ATb<08pl|$#|1g";

module.exports = {
  isAuthenticated: function (req, res, next) {
    //Set empty token to be replaced later
    let token = null;

    if (req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }
    //ICheck for null/undefined token in the request
    if (!token) {
      return res.send({
        color: "error",
        message: "Please login to continue",
      });
    }
    try {
      //Valid token, call next
      var decoded = jwt.verify(token, jwtSecret).user;
      users
        .findOne({
          where: {
            id: decoded.id,
          },
        })
        .then((user) => {
          //If user is not active
          if (user.status_id !== 2) {
            return res.send({
              color: "error",
              message: "User is not active",
            });
          } else {
            next();
          }
        })
        .catch((err) => {
          return res.send({
            type: "error",
            message: err,
          });
        });
    } catch (err) {
      //If error send back error message
      console.log(err);
      switch (err.name) {
        case "TokenExpiredError":
          return res.send({
            color: "error",
            message: "Your Login has expired.",
          });
          break;
        case "JsonWebTokenError":
          return res.send({
            color: "error",
            message: "Invalid Token",
          });
          break;
        default:
          res.send({
            color: "error",
            message: "Error, Please try again",
          });
      }
    }
  },
  decodeToken(req, res, next) {
    let token = req.headers.authorization.replace("Bearer ", "");
    try {
      var decoded = jwt.verify(token, jwtSecret);
      return decoded;
    } catch (err) {
      // err
      return res.send({
        type: "error",
        message: err,
      });
    }
  },
  signUser(user) {
    return jwt.sign(
      {
        user: user,
      },
      jwtSecret,
      {
        expiresIn: ONE_WEEK,
      }
    );
  },
  jwtSecret,
};
