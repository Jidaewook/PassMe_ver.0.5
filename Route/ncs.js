const express = require('express');
const router = express.Router();
const ncsModel = require('../model/ncs');


// create 
// @route POST /lecture/ncs
// @desc Create ncs
// @access public(최종 private: admin)

router.post('/', (req, res) => {
    const ncsFields = {};

    if(req.body.title) ncsFields.title = req.body.title;
    if(req.body.desc) ncsFields.desc = req.body.desc;
    if(req.body.url) ncsFields.url = req.body.url;
    if(req.body.thumbnail) ncsFields.thumbnail = req.body.thumbnail;
    if(req.body.attached) ncsFields.attached = req.body.attached;
    if(typeof req.body.tag !== 'undefined'){
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
});



// get

// detailget

// patch

// delete


module.exports = router;
