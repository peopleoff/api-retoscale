const {
    synergies
} = require('../models');
const {
    items
} = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

items.hasMany(synergies, {
    foreignKey: 'id'
});

synergies.belongsTo(items, {
    foreignKey: 'item_one_id',
    as: 'Item_One'
});

synergies.belongsTo(items, {
    foreignKey: 'item_two_id',
    as: 'Item_Two'
});

module.exports = {

    async getSynergies(req, res) {
        try {
            await synergies.findAll({
                    include: [{
                            model: items,
                            as: 'Item_One'
                        },
                        {
                            model: items,
                            as: 'Item_Two'
                        }
                    ]
                })
                .then(results => {
                    res.send(results);
                });
        } catch (err) {
            console.log(err);
            return res.send({
                type: 'error',
                message: err
            })
        }
    },
    async updateSynergies(req, res) {
        let synergie = req.body.synergie;
        try {
            await synergies.update({
                scale: synergie.scale,
                notes: synergie.notes,
            }, {
                where: {
                    id: synergie.id
                }
            })
            res.status(200).send({
                type: 'success',
                message: "Synergie Updated"
            })
        } catch (err) {
            return res.send({
                type: 'error',
                message: err
            })
        }
    },

}