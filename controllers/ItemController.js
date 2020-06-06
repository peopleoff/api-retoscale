const {
    items
} = require('../models');
const {
    synergies
} = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    async addItem(req, res) {
        let item = req.body.item;
        if (item.tier == 'None' || !item.tier) {
            item.tier = null
        }
        try {
            await items.create(item);
            res.status(200).send({
                type: 'success',
                message: "Item Added"
            })
        } catch (err) {
            return res.send({
                type: 'error',
                message: err
            })
        }
    },
    async updateItem(req, res) {
        let item = req.body.item;
        if (item.tier == 'None' || !item.tier) {
            item.tier = null
        }
        try {
            await items.update({
                name: item.name,
                image: item.image,
                description: item.description,
                tier: item.tier,
                type: item.type,
                scale: item.scale,
                notes: item.notes,
            }, {
                where: {
                    id: item.id
                }
            })
            res.status(200).send({
                type: 'success',
                message: "Item Updated"
            })
        } catch (err) {
            return res.send({
                type: 'error',
                message: err
            })
        }
    },
    async getItems(req, res) {
        try {
            const allitems = await items.findAll();
            res.send(allitems);
        } catch (err) {
            return res.send({
                type: 'error',
                message: err
            })
        }
    },
    async getLastUpdated(req, res) {
        try {
            items.findOne({
                order: [
                    ['updatedAt', 'DESC']
                ],
                attributes: ['updatedAt', ]
            }).then(timeStamp => {
                // project will be the first entry of the Projects table with the title 'aProject' || null
                // project.title will contain the name of the project
                res.send(timeStamp);
            })
        } catch (err) {
            return res.send({
                
                type: 'error',
                message: err
            })
        }
    },
    deleteItem(req, res) {
        let item = req.body.item;
        try {
            items.destroy({
                where: {
                    id: item.id
                }
            }).then(function (result) {
                res.status(200).send({
                    type: 'success',
                    message: "Item Deleted"
                })
            });
        } catch (err) {
            return res.send({
                type: 'error',
                message: err
            })
        }
    }
};