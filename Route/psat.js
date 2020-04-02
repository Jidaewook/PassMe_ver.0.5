const express = require('express');
const router = express.Router();
const multer = require('multer');

const psatModel = require('../model/psat');

// upload files
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);

    }
});

const imageFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: imageFilter
});


// create 
// @route POST /lecture/psat
// @desc Create psat
// @access private(admin)

router.post('/', upload.single('thumbnail'), (req, res) => {
    const psatFields = {};

    if(req.body.title) psatFields.title = req.body.title;
    if(req.body.desc) psatFields.desc = req.body.desc;
    if(req.body.url) psatFields.url = req.body.url;
    if(req.file.path) psatFields.thumbnail = req.file.path;
    if(req.body.attached) psatFields.attached = req.body.attached;
    if(typeof req.body.tag !== 'undefined'){
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
});


// get
router.get('/', (req, res) => {
    psatModel
        .find()
        .then(items => {
            res.status(200).json({
                message: 'Successful Get PSAT',
                count: items.length,
                psatInfo: items
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});

// detailget

// patch

// delete


module.exports = router;
