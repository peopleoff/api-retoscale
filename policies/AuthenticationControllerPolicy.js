const Joi = require('joi');

module.exports = {
    register(req, res, next) {
        const schema = {
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            username: Joi.string().required(),
            registerKey: Joi.string().required(),
            password: Joi.string().regex(new RegExp('^[a-zA-Z0-9]{4,32}')),
            confirmPassword: Joi.string().regex(new RegExp('^[a-zA-Z0-9]{4,32}')),
            email: Joi.string().required()
        };

        const {error, value} = Joi.validate(req.body, schema);

        if (error) {
            switch (error.details[0].context.key) {
                case 'username':
                    res.send({
                        
                        message: 'Login must be a string'
                    });
                    break;
                case 'password':
                    res.send({
                        
                        message: `The password provided must be greater then 4 characters.`
                    });
                    break;
                default:
                    res.send({
                        
                        message: error
                    })
            }
        } else {
            next()
        }
    },

    changePassword(req, res, next) {
        const schema = {
            id: Joi.number(),
            newPassword: Joi.string().regex(new RegExp('^[a-zA-Z0-9]{4,32}')),
            newPassword2: Joi.string().regex(new RegExp('^[a-zA-Z0-9]{4,32}')),
        };
        const {error, value} = Joi.validate(req.body, schema);
        if (error) {
            switch (error.details[0].context.key) {
                case 'newPassword2':
                    res.send({
                        
                        message: `The password provided must be greater then 5 characters.`
                    });
                    break;
                default:
                    res.send({
                        
                        message: error
                    })
            }
        } else {
            next()
        }
    }
};