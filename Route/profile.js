const express = require('express');
const router = express.Router();

const passport = require('passport');
const checkAuth = passport.authenticate('jwt', { session: false });

const {profile_post, profile_get, profile_del} = require('../controller/profile');

router.post('/', checkAuth, profile_post);

router.get('/', checkAuth, profile_get);

router.delete('/:profileId', checkAuth, profile_del)

module.exports = router;