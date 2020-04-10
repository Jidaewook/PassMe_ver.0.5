const express = require('express');
const router = express.Router();
const tokenGenerator = require('../config/tokengenerator');

const userModel = require('../model/user');

const mailgun = require('../config/mailgun');
const template = require('../config/template');

const {user_register} = require('../controller/user');
// register
// @route POST users/register
// @desc register user
// @access public

router.post('/register', user_register);

// login
// @route POST users/login
// @desc login user / Returning JWT Token
// @access public

router.post('/login', (req, res) => {
    const {email, password} = req.body;

    userModel
        .findOne({email})
        .then(user => {
            if(!user){
                return res.status(404).json({
                    error: 'user not found'
                }); 
            }
            user.comparePassword(password, (err, isMatch) => {
                if(err) throw err;
                const payload = { id: user._id, name: user.name, email: user.email, avatar: user.avatar };

                res.status(200).json({
                    success: isMatch,
                    token: tokenGenerator(payload)
                });
            })

        });

});

router.put('/forgot', (req, res) => {
    // const {email} = req.body;

    // userModel
    //     .findOne({email}, (err, user) => {
    //         if(err || !user){
    //             return res.status(400).json({
    //                 error: 'User with that email does not exist'
    //             });
    //         }
    //         const token = jwt.sign(
    //             {_id: user._id, name: user.name},
    //             process.env.JWT_RESET_PASSWORD,
    //             {expiresIn: '10m'}
    //         )
            
});


// @route PUT users/reset
// @desc Profile RESET
// @account Private

router.put('/reset', (req, res) => {
    const {name, password} = req.body;

    userModel
        .findOne({_id: req.user._id}, (err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
            if(!name){
                return res.status(400).json({
                    error: 'Name is required'
                });
            } else {
                user.name = name;
            }
            if(password) {
                if(password.length < 6) {
                    return res.status(400).json({
                        error: 'Password should be min 6characters long'
                    });
                } else {
                    user.password = password;
                }
            }
            user.save((err, updatedUser) => {
                if(err) {
                    console.log('USER UPDATE ERROR', err);
                    return res.status(400).json({
                        error: 'USER UPDATE FAILED'
                    });
                }
                updatedUser.hashed_password = undefined;
                updatedUser.salt = undefined;
                res.json(updatedUser);
            });
        });
});

router.post('/account-activation', (req, res) => {
    const {token} = req.body;

    if(token) {
        jwt.verify(token, process.env.JWT_ACCOUNAT_ACTIVATION, function(err, decoded){
            if(err) {
                return res.status(401).json({
                    error: 'Expired link. Signup again'
                });
            }
            const {name, email, password} = jwt.decode(token);

            const user = new userModel({ name, email, password });

            user    
                .save((err, user) => {
                    if(err) {
                        return res.status(401).json({
                            error: 'Error saving user in database. Try signup again'
                        });
                    }
                    return res.json({
                        message: 'Signup success. Please Signin'
                    });
                });
        });
    } else {
        return res.json({
            message: 'Something went wrong. Try again'
        });
    }
});



module.exports = router;
