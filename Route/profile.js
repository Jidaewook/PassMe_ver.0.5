const express = require('express');
const router = express.Router();
const tokenGenerator = require('../config/tokengenerator');
const passport = require('passport');
const checkAuth = passport.authenticate('jwt', { session: false });

const {profile_post} = require('../controller/profile');

router.post('/post', profile_post);

module.exports = router;