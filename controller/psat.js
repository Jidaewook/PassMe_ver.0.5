const psatModel = require('../model/psat');
const mailgun = require('../config/mailgun');
const template = require('../config/template');

exports.psat_post = (req, res) => {
    const psatFields = {};

    if (req.body.title) psatFields.title = req.body.title;
    if (req.body.desc) psatFields.desc = req.body.desc;
    if (req.body.url) psatFields.url = req.body.url;
    if (req.file.path) psatFields.thumbnail = req.file.path;
    if (req.body.attached) psatFields.attached = req.body.attached;
    if (typeof req.body.tag !== 'undefined') {
        psatFields.tag = req.body.tag.split(',')
    }

    const newPsat = new psatModel(psatFields);
    newPsat
        .save()
        .then(item => {
            res.status(200).json({
                message: 'Successful Psat',
                psatInfo: item
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
};

exports.psat_get = (req, res) => {
    psatModel
        .find()
        .then(items => {
            res.status(200).json({
                message: 'Successful Get PSAT',
                count: items.length,
                results: items
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
};