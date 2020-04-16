const userModel = require('../model/user');
const mailgun = require('../config/mailgun');
const template = require('../config/template');

exports.profile_post = (req, res) => {
    const {age, bio, major, location, testname, preference, task} = req.body;

    profileModel
        .findOne({ email })
        .then(profile => {
            if(!profile) {
                return res.status(404).json({
                    error: 'User not exist'
                });
            }
            const newProfile = new profileModel({
                age, bio, major, location, testname, preference, task
            });

            newProfile
                .save()
                .then(profile => {
                    res.status(200).json({
                        message: "Successful new Profile",
                        profileInfo: profile
                    });

                    // userInfo처럼 프로필 내용을 메일로 보낼 필요가 없음

                })
                .catch(err => {
                    res.status(400).json({
                        message: err.message
                    });
                });
        });

};