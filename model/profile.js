const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        age: {
            type: Number
        },
        bio: {
            type: String
        },
        major: {
            type: String
        },
        location: {
            type: [String]
        },
        testname: {
            type: [String]
            // required: true
        },
        preference: {
            type: [String]
        },
        task: {
            type: [String]
            // required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model('profile', ProfileSchema);
