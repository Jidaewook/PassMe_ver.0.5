const express = require('express');
const router = express.Router();
const multer = require('multer');

const psatModel = require('../model/psat');

const {psat_post, psat_get} = require('../controller/psat');
const upload = require('../config/multer');

// create 
// @route POST /lecture/psat
// @desc Create psat
// @access private(admin)

router.post('/', upload.upload.single('thumbnail'), psat_post);


// get
router.get('/', psat_get);

// detailget

// patch

// delete


module.exports = router;
