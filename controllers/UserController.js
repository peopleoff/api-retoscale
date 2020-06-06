const {
    users
} = require('../models');
const {
    status_types
} = require('../models');
const bcrypt = require('bcryptjs');
const salt = '$2a$10$Q/AH0MPPKyMVNzshASojgO';
const jwt = require('jsonwebtoken');
const registerKey = "RetroFunTimes"
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//jwt config
const {
    signUser,
    decodeToken,
    jwtSecret
} = require('../config/auth');

users.belongsTo(status_types, {
    foreignKey: 'status_id'
});

module.exports = {
    register(req, res) {
        if (!req.body) {
            return res.send({

                message: "Error",
                type: "error"
            })
        }
        if (req.body.password !== req.body.confirmPassword) {
            return res.send({

                message: "Passwords do not match",
                type: "error"
            })
        }
        if (req.body.registerKey !== registerKey) {
            return res.send({

                message: "Invalid Register Key",
                type: "error"
            })
        }
        users.findOne({
                where: {
                    username: req.body.username
                }
            }).then(project => {
                if (project) {
                    return res.send({

                        message: "User already exsists",
                        type: "error"
                    })
                } else {
                    req.body.password = bcrypt.hashSync(req.body.password, salt);
                    req.body.status = 3;
                    users.create(req.body).then(response => {
                        return res.send({

                            message: "Thank you for registering, Please wait for your account to be approved.",
                            type: "success"
                        })
                    });
                }
            })
            .catch(err => {
                return res.send({

                    type: 'error',
                    message: err
                })
            });
    },
    passwordReset(req, res) {
        if (!req.body) {
            return res.send({

                message: "No Email Found",
                type: "error"
            })
        };
        if (!validateEmail(req.body.email)) {
            return res.send({

                message: "Invalid Email",
                type: "error"
            })
        };
        let token = jwt.sign({
            email: req.body.email
        }, jwtSecret, {
            expiresIn: '10m',
        });
        users.update({
                reset_token: token
            }, {
                where: {
                    email: req.body.email
                }
            })
            .then(result => {
                if (result[0] !== 0) {
                    const msg = {
                        to: req.body.email,
                        from: 'support@ruslanbelyy.com',
                        subject: 'Retoscale Password Reset',
                        html: `
                            Please use the following link to <a href="retoscale.com/reset/${token}"> reset your password </a>
                            <br>
                            If you did not request this password change please feel free to ignore it.
                            <br>
                        `,
                    };
                    sgMail.send(msg);
                    return res.send({

                        message: "A password reset has been sent. Please check your email for further instructions.",
                        type: "success"
                    })
                } else {
                    return res.send({

                        message: "A password reset has been sent. Please check your email for further instructions.",
                        type: "success"
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    },
    changePassword(req, res) {
        if (!req.body) {
            return res.send({

                message: "Please try again",
                type: "error"
            })
        };
        // verify a token symmetric
        jwt.verify(req.body.token, jwtSecret, function (err, decoded) {
            if (!decoded) {
                return res.send({

                    message: "Token has expired. Please resend password reset.",
                    type: 'error'
                })
            } else {
                req.body.password = bcrypt.hashSync(req.body.password, salt);
                users.update({
                        password: req.body.password
                    }, {
                        where: {
                            reset_token: req.body.token
                        }
                    })
                    .then(result => {
                        if (result[0] !== 0) {
                            return res.send({

                                message: "Your password has been succesfully changed",
                                type: "success"
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        });
    },
    signIn(req, res) {
        if (req.body.token) {
            try {
                decoded = jwt.verify(req.body.token, jwtSecret).user;
                return res.send({
                    token: req.body.token,
                    username: decoded.username
                })
            } catch (err) {
                return res.send({
                    type: 'error',
                    message: err
                })
            }
        }
        if (!req.body) {
            return res.send({
                message: "Please fill in all fields",
                type: "error"
            })
        }
        users.findOne({
                where: {
                    username: req.body.username
                }
            })
            .then(user => {
                if (!user) {
                    return res.send({
                        message: "Username or Password is incorrect",
                        type: "error"
                    })
                } else {
                    if (bcrypt.compareSync(req.body.password, user.password) && user.status_id == 2) {
                        delete user.password
                        let token = signUser(user);
                        res.send({
                            token: token,
                            username: user.username
                        });
                    } else {
                        return res.send({
                            message: 'Username or Password incorrect',
                            type: "error"
                        });
                    }
                }
            });
    },
    async updateUserStatus(req, res) {
        let user = req.body.user;
        try {
            await users.update({
                status_id: user.status_id
            }, {
                where: {
                    id: user.id
                }
            })
            res.status(200).send({
                type: 'success',
                message: "User Updated"
            })
        } catch (err) {
            return res.send({
                type: 'error',
                message: err
            })
        }
    },
    async updateUser(req, res) {
        let user = req.body;
        console.log(req.body);
        try {
            await users.update({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            }, {
                where: {
                    id: user.id
                },
            }).then(result => {
                //Result returns number of affected rows.
                //0 means no rows were effected and the update failed.
                if (result == 0) {
                    return res.send({
                        error: true,
                        type: 'error',
                        message: 'Error editing user'
                    })
                } else {
                    return res.send({
                        error: true,
                        type: 'success',
                        message: 'User Updated'
                    })
                }
            })
        } catch (err) {
            return res.send({

                type: 'error',
                message: err
            })
        }
    },
    async getUsers(req, res) {
        try {
            const allitems = await users.findAll({
                attributes: ['id', 'firstname', 'lastname', 'username', 'status_id'],
                include: [status_types]
            });
            res.send(allitems);
        } catch (err) {
            return res.send({

                type: 'error',
                message: err
            })
        }
    },
    async getUser(req, res) {
        let decoded = decodeToken(req);
        try {
            users.findOne({
                where: {
                    id: decoded.user.id
                },
                attributes: ['id', 'firstname', 'lastname', 'username', 'email']
            }).then(user => {
                // project will be the first entry of the Projects table with the title 'aProject' || null
                // project.title will contain the name of the project
                res.send(user);
            })
        } catch (err) {
            return res.send({

                type: 'error',
                message: err
            })
        }
    },
    async isAuth(req, res) {
        try {
            //Valid token, call next
            var decoded = jwt.verify(token, jwtSecret);
            return res.send({

            })
        } catch (err) {
            //If error send back error message
            switch (err.name) {
                case 'TokenExpiredError':
                    return res.send({
                        color: 'error',
                        message: 'Your Login has expired.'
                    });
                    break;
                case 'JsonWebTokenError':
                    return res.send({
                        color: 'error',
                        message: 'Invalid Token'
                    });
                    break;
                default:
                    res.send({
                        color: 'error',
                        message: err
                    })
            }
        }
    },
}