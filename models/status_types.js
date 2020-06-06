/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('status_types', {
        name: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        description: {
            type: DataTypes.STRING(250),
            allowNull: true
        }
    }, {
        tableName: 'status_types'
    });
};
