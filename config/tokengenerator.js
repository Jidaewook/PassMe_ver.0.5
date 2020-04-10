const jwt = require('jsonwebtoken');

const tokenGenerator = payload => {
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: 36000});

    return "Bearer " + token
};

module.exports = tokenGenerator;