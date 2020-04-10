const userModel = require('../model/user');
const mailgun = require('../config/mailgun');
const template = require('../config/template');


exports.user_register = (req, res) => {

    const { name, email, password } = req.body;


    userModel
        .findOne({ email })
        .then(user => {
            if (user) {
                return res.status(404).json({
                    error: 'Email already exists'
                });
            }
            const newUser = new userModel({
                name, email, password
            });

            newUser
                .save()
                .then(user => {
                    res.status(200).json({
                        message: "Successful new User",
                        userInfo: user
                    });

                    const message = template.signupEmail(user.name);
                    mailgun.sendEmail(user.email, message);
                })
                .catch(err => {
                    res.status(400).json({
                        message: err.message
                    });
                });
        });

};