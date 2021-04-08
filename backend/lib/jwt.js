var jwt = require('jsonwebtoken');

function getToken(data) {
    let token = jwt.sign(data, process.env.SECRET_KEY, {
        expiresIn: 86400 // expires in 24 hours
    });
    return token
}

module.exports = getToken;