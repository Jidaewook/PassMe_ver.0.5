const express = require('express');
const router = express.Router();

const passport = require('passport');

const mailgun = require('../config/mailgun');
const template = require('../config/template');

const {
    user_register, 
    user_login, 
    user_forgot, 
    user_reset, 
    user_current
} = require('../controller/user');

const checkAuth = passport.authenticate('jwt', {session: false});

// register
// @route POST users/register
// @desc register user
// @access public

router.post('/register', user_register);

// login
// @route POST users/login
// @desc login user / Returning JWT Token
// @access public

router.post('/login', user_login);

router.post('/forgot', user_forgot);

router.post('/reset/:token', user_reset);

// @route PUT users/reset
// @desc Profile RESET
// @account Private

// router.post('/account-activation', (req, res) => {
    // const {token} = req.body;

    // if(token) {
    //     jwt.verify(token, process.env.JWT_ACCOUNAT_ACTIVATION, function(err, decoded){
    //         if(err) {
    //             return res.status(401).json({
    //                 error: 'Expired link. Signup again'
    //             });
    //         }
    //         const {name, email, password} = jwt.decode(token);

    //         const user = new userModel({ name, email, password });

    //         user    
    //             .save((err, user) => {
    //                 if(err) {
    //                     return res.status(401).json({
    //                         error: 'Error saving user in database. Try signup again'
    //                     });
    //                 }
    //                 return res.json({
    //                     message: 'Signup success. Please Signin'
    //                 });
    //             });
    //     });
    // } else {
    //     return res.json({
    //         message: 'Something went wrong. Try again'
    //     });
    // }
// });

// 유저 토큰을 넣으면 현재 유저가 들어왔는지 확인하기(헤더에서 Authorization에 토큰 정보를 넣어주면 된다.)
router.get('/current', checkAuth, user_current);


module.exports = router;
