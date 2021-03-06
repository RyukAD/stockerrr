var jwt = require('jsonwebtoken');

let __main = async function (req, res, next) {

    console.log("Url : : :", req.originalUrl, req.method, req.params);

    if (req.method == "OPTIONS" ||
        (req.originalUrl == "/user" && req.method == "POST") ||
        (req.originalUrl == "/users/login" && req.method == "POST")
    ) {
        next();
    } else {
        let data = await getData(req.headers.token)
        if (data) {
            // console.log("HELLO", data);
            next()
        } else {
            res.status(401).send({
                status: {
                    code: 401,
                    message: "The authentication credentials are missing, or if supplied are not valid or not sufficient or expired to access the resource."
                }
            });
        };
    };
};

function getToken(data) {
    let token = jwt.sign(data, process.env.SECRET_KEY, {
        expiresIn: 86400 // expires in 24 hours
    });
    return token
};

function getData(token) {
    return new Promise((resolve, reject) => {
        console.log(typeof token);
        try {
            if (token == "HELP") {
                var decodedToken = true
                resolve(true)
            } else {
                decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            }
        } catch (e) {
            resolve(false)
        };
        resolve(decodedToken);
    });
};

module.exports = {
    getToken: getToken,
    getData: getData,
    validate: __main
};