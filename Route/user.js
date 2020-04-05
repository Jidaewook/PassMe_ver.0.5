const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


const userModel = require('../model/user');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(preocess.env.SENDGRID_API_KEY);

// register
// @route POST users/register
// @desc register user
// @access public

router.post('/register', (req, res) => {
    const {name, email, password} = req.body;

    userModel
        .findOne({email})
        .then(user => {
            if(user){
                return res.status(404).json({
                    error: 'Email already exists'
                });
            } 
            const newUser = new userModel({
                name, email, password
            });
            const token = jwt.sign(
                {name, email, password}, 
                process.env.JWT_ACCOUNAT_ACTIVATION,
                {expiresIn: '10m'}
            );
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: 'email',
                subject: 'Account activation link',
                html: `
                    <h1>Please use the following link to activate your account</h1>
                    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                
                `
            };
            // 센드그리드 항목
            sgMail
                .send(emailData)
                .then(sent => {
                    return res.status(200).json({
                        message: 'Email has been sent to ${email}. Follow the instruction to activate your account'
                    });
                })
                .catch(err => {
                    return res.json({
                        message: err.message
                    });
                });                    
                
        });
        
});

// login
// @route POST users/login
// @desc login user / Returning JWT Token
// @access public

router.post('/login', (req, res) => {
    const {email, password} = req.body;

    userModel
        .findOne({email})
        .exec((err, user) => {
            if(err || !user) {
                return res.json(400).json({
                    error: 'User with that email does not exist. please signup'
                });
            }
            if(!user.authenticate(password)){
                return res.status(400).json({
                    error: 'Email and password do not match'
                });
            }
            const token = jwt.sign({
                _id: user._id
            },
            process.env.JwT_SECRET, {expiresIn: '7d'};
            const {_id, name, email, role} = user;
            return res.status(200).json({
                tokenInfo: token,
                user: {_id, name, email, role}
            }); 
        })
});

router.put('/forgot', (req, res) => {
    const {email} = req.body;

    userModel
        .findOne({email}, (err, user) => {
            if(err || !user){
                return res.status(400).json({
                    error: 'User with that email does not exist'
                });
            }
            const token = jwt.sign(
                {_id: user._id, name: user.name},
                process.env.JWT_RESET_PASSWORD,
                {expiresIn: '10m'}
            )
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: `Password Reset Link`,
                html: 
                    `
                        <h1>Please use the follwing link to reset your password</h1>
                        <p>${process.env.CLIENT_URL}/auth/password/reset${token}</p>
                        <hr />
                        <p>This email may contain sensetive information</p>
                        <p>${process.env.CLIENT_URL}</p>
                    `
            };

// SGMAIL에서 인증을 거부한 상황이기 때문에 SGMAIL항목은 바꿔야 함
            return user    
                .updateOne({resetPasswordLink: token}, (err, success) => {
                    if(err){
                        return res.status(400).json({
                            error: 'Database connection error on user password forgot request'
                        });
                    } else {
                        sgMail
                            .send(emailData)
                            .then(sent => {
                                return res.json({
                                    message: `Email has been setn to ${email}. Follow the instruction to activate your account`
                                });
                            })
                            .catch(err => {
                                return res.json({
                                    message: err.message
                                });
                            });
                    };
                })
        })
})


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
