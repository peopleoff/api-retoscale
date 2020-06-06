module.exports = function (sequelize, DataTypes) {

    const items = sequelize.define('items', {
        name: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        description: {
            type: DataTypes.STRING(3000),
            allowNull: true
        },
        tier: {
            type: DataTypes.STRING(5),
            allowNull: true
        },
        type: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        scale: {
            type: DataTypes.FLOAT(10),
            defaultValue: 0,
            allowNull: true
        },
        notes: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
    }, {
        tableName: 'items'
    });

    return items
};