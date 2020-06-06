/* jshint indent: 2 */
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcryptjs'));


module.exports = function (sequelize, DataTypes) {

    const users = sequelize.define('users', {
        firstname: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        lastname: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        reset_token: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        status_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '3',
            references: {
                model: 'status_types',
                key: 'id'
            }
        },
        email: {
            type: DataTypes.STRING(250),
            allowNull: true
        }
    }, {
        tableName: 'users'
    });

    users.beforeCreate(function (user, options) {
        return cryptPassword(user.password)
            .then(success => {
                user.password = success;
            })
            .catch(err => {
                if (err) console.log(err);
            });
    });

    users.beforeUpdate(function (user, options) {
        return cryptPassword(user.password)
            .then(success => {
                user.password = success;
            })
            .catch(err => {
                if (err) console.log(err);
            });
    });

    function cryptPassword(password) {
        console.log("cryptPassword" + password);
        return new Promise(function (resolve, reject) {
            bcrypt.genSalt(10, function (err, salt) {
                // Encrypt password using bycrpt module
                if (err) return reject(err);

                bcrypt.hash(password, salt, null, function (err, hash) {
                    if (err) return reject(err);
                    return resolve(hash);
                });
            });
        });
    };

    return users
};