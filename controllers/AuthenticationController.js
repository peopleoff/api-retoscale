const { users } = require("../models");
const { server_user_groups } = require("../models");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

function jwtSignUser(user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, jwtSecret, {
    expiresIn: ONE_WEEK,
  });
}

module.exports = {
  async register(req, res) {
    try {
      await users.create(req.body);
      res.send({
        message: "User Added",
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        message: "failed",
      });
    }
  },

  async login(req, res) {
    try {
      const { user_login, user_password } = req.body;

      const loginUser = await users.find({
        where: {
          user_login: user_login,
        },
      });
      if (!loginUser) {
        return res.status(403).send({
          error: "login information is incorrect",
        });
      }
      const validPassword = loginUser.comparePassword(user_password);
      if (validPassword) {
        const userJson = loginUser.toJSON();
        res.send({
          user: userJson,
          token: jwtSignUser(userJson),
        });
      } else {
        return res.status(403).send({
          error: "login information is incorrect",
        });
      }
    } catch (err) {
      res.status(500).send({
        error: err,
        message: "failed login",
      });
    }
  },

  async isAuth(req, res) {
    if (req.body.user_group === 1) {
      res.send(true);
    } else {
      try {
        const { user_id, user_group_id, server_id } = req.body;
        const isAuth = await server_user_groups.findOne({
          where: {
            server_id: server_id,
            [Op.or]: [{ user_id: user_id }, { user_group_id: user_group_id }],
          },
        });
        if (isAuth) {
          res.send(true);
        } else {
          res.send(false);
        }
      } catch (err) {
        res.status(500).send({
          error: err,
          message: "failed login",
        });
      }
    }
  },

  async changePassword(req, res) {
    try {
      const { id, newPassword, newPassword2 } = req.body;

      const loginUser = await users.find({
        where: {
          id: id,
        },
      });

      //Check if passwords match
      if (newPassword !== newPassword2) {
        return res.status(403).send({
          error: "Passwords don't match",
        });
      }
      loginUser.update({ user_password: newPassword2 });
      res.send({
        message: "Password changed",
      });
    } catch (err) {
      res.status(500).send({
        error: err,
        message: "failed login",
      });
    }
  },
};
