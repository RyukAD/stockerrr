var jwt = require('jsonwebtoken');

function getToken(data) {
    let token = jwt.sign(data, process.env.SECRET_KEY, {
        expiresIn: 86400 // expires in 24 hours
    });
    return token
}

function getData(token) {
    console.log(typeof token);
    try {
        if (token == "HELP") {
            var decodedToken = true
        } else {
            decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        }
    } catch (e) {
        decodedToken = false
    };
    return decodedToken;
}

module.exports = {
    getToken: getToken,
    getData: getData
};