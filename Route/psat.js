const express = require('express');
const router = express.Router();
const multer = require('multer');

const psatModel = require('../model/psat');

const {psat_post, psat_get} = require('../controller/psat');
const {} = require('../controller/multer');

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

router.post('/', upload.single('thumbnail'), psat_post);


// get
router.get('/', psat_get);

// detailget

// patch

// delete


module.exports = router;
