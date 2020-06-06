module.exports = function (sequelize, DataTypes) {

    const synergies = sequelize.define('synergies', {
        name: {
            type: DataTypes.STRING(250),
            allowNull: false
        
        },
        item_one_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'items',
                key: 'id'
            }
        },
        item_two_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'items',
                key: 'id'
            }
        },
        description: {
            type: DataTypes.STRING(3000),
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
        tableName: 'synergies'
    });

    return synergies
};