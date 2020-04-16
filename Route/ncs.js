const express = require('express');
const router = express.Router();

const ncsModel = require('../model/ncs');
const {ncs_post, ncs_get} = require('../controller/ncs');
// upload files
const upload = require('../config/multer');

// create 
// @route POST /lecture/ncs
// @desc Create ncs
// @access public(최종 private: admin)

router.post('/', upload.upload.single('thumbnail'), ncs_post);

// get
router.get('/', ncs_get);

// detailget

// patch

// delete


module.exports = router;
