const ncsModel = require('../model/ncs');
const mailgun = require('../config/mailgun');
const template = require('../config/template');

exports.ncs_post = (req, res) => {
    const ncsFields = {};

    if (req.body.title) ncsFields.title = req.body.title;
    if (req.body.desc) ncsFields.desc = req.body.desc;
    if (req.body.url) ncsFields.url = req.body.url;
    if (req.file.path) ncsFields.thumbnail = req.file.path;
    if (req.body.attached) ncsFields.attached = req.body.attached;
    if (typeof req.body.tag !== 'undefined') {
        ncsFields.tag = req.body.tag.split(',')
    }

    const newNcs = new ncsModel(ncsFields);
    newNcs
        .save()
        .then(item => {
            res.status(200).json({
                message: 'Successful Ncs',
                ncsInfo: item

            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
};

exports.ncs_get = (req, res) => {
    ncsModel
        .find()
        .then(items => {
            res.status(200).json({
                message: 'Successful Get NCS',
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