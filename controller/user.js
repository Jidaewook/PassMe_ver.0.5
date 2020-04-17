const userModel = require('../model/user');
const mailgun = require('../config/mailgun');
const template = require('../config/template');
const tokenGenerator = require('../config/tokengenerator');
const passport = require('passport');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');




exports.user_register =(req, res) => {
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

                    // const message = template.signupEmail(user.name);
                    // mailgun.sendEmail(user.email, message);
                })
                .catch(err => {
                    res.status(400).json({
                        message: err.message
                    });
                });
        });
    };

exports.user_login = (req, res) => {
    const { email, password } = req.body;

    userModel
        .findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    error: 'user not found'
                });
            }
            user.comparePassword(password, (err, isMatch) => {
                if (err) throw err;
                const payload = { id: user._id, name: user.name, email: user.email, avatar: user.avatar };

                res.status(200).json({
                    success: isMatch,
                    token: tokenGenerator(payload)
                });
            })

        });

};

exports.user_forgot = (req, res) => {
    const { email } = req.body;

    userModel
        .findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    message: 'user not found, 이메일이 없음'
                });
            }
            crypto.randomBytes(48, (err, buffer) => {

                const resetToken = buffer.toString('hex');
                console.log(resetToken);

                if (err) {
                    return res.status(400).json({
                        error: '리셋토큰 생성 중 에러'
                    });
                }
                user.resetPasswordToken = resetToken;
                user.resetPasswordExpires = Date.now() + 3600000;

                user
                    .save(err => {
                        if (err) {
                            return res.status(422).json({
                                error: '저장이 안됨'
                            });
                        }
                        // const message = template.resetEmail(req, resetToken);

                        // mailgun.sendEmail(user.email, message);

                        return res.status(200).json({
                            success: true,
                            message: '이메일로 패스워드를 리셋하기 위한 링크를 보냈다.',
                            tokenInfo: user.resetPasswordToken

                        })
                    });


            });

        })



};

exports.user_reset = (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(422).json({
            error: '비밀번호를 입력하세요.'
        })
    }
    userModel
        .findOne(
            {
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() }
            },
        )
        .then(user => {
            console.log(user);
            if (!user) {
                return res.status(422).json({
                    error: '사용자 토큰이 만료되었습니다. 다시 로그인하세요.'
                });
            }
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                        return res.status(422).json({
                            error: err.message
                        });
                    }
                    password = hash;

                    user.password = password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user
                        .save(err => {
                            if (err) {
                                return res.status(422).json({
                                    error: '리셋한 패스워드를 저장하는 과정에서 에러가 발생했습니다.'
                                });
                            }

                            // const message = template.confirmResetPasswordEmail();
                            // mailgun.sendEmail(user.email, message);

                            return res.status(200).json({
                                success: true,
                                message: '패스워드가 리셋되었고, 이메일을 보내주었다.'
                            })
                        })

                })
            });
        })
        .catch();
};

exports.user_current = (req, res) => {
    res.status(200).json({
        userInfo: req.user
    });
};