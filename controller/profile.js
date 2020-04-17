const profileModel = require('../model/profile');
const userModel = require('../model/user');

exports.profile_post = (req, res) => {

    const {age, bio, major, location, testname, preference, task} = req.body;

    console.log(req.user);
    userModel
        .findById(req.user.id)
        .then(user => {
            if(!user){
                return res.status(404).json({
                    error: 'User not exist'
                });
                
            }
          
            const newProfile = new profileModel({
                user: req.user.id,
                age, bio, major, location, testname, preference, task
            });

            newProfile 
                .save()
                .then(profile => {
                    res.status(200).json({
                        profileInfo: profile
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        message: err.message
                    });
                });
        });

};

exports.profile_get = (req, res) => {
    
    profileModel
        .findOne({user: req.user.id})
        //""는 안됨, ''만 인식함
        .populate('user', ['email', 'avatar'])
        .then(profile => {
            res.status(200).json({
                profileInfo: profile
            });
        });
        

};

//탈퇴하기
exports.profile_del = (req, res) => {
    userModel
        .findByIdAndDelete(req.user.id)
        .then(() => {
            profileModel
                .findByIdAndDelete(req.params.profileId)
                .then(() => {
                    res.status(200).json({
                        message: "Successful Delete"
                    });
                });
                
        })
        .catch(err => {
            res.status(400).json({
                message: err.message
            });
        });
        
};

//프로필 수정
exports.profile_patch = (req, res) => {
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            if(!profile){
                res.status(400).json({
                    message: "DB have not your profile"
                });
            }
            
            const { age, bio, major, location, testname, preference, task } = req.body;

            profileModel
                .findOneAndUpdate(
                    {user: req.user.id},
                    {$set: {age, bio, major, location, testname, preference, task}},
                    {new: true}
                )
                .then(profile => {
                    res.status(200).json({
                        message: "Updated profile",
                        newProfile: profile
                    });
                });

        });
};