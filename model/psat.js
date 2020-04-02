
const mongoose = require('mongoose');

const psatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        title: {
            type: String
        },
        desc: {
            type: String
        },
        url: {
            type: String
        },
        thumbnail: {
            type: String
        },
        attached: {
            type: String
        },

        tag: [
            {
                type: String
            }
        ],

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('psat', psatSchema);