//dependencies together
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

//models
var User = require(__dirname + "/../../models/User")


//libs
createResponse = require(__dirname + "/../../lib/responseObject");


module.exports = {
    register: async (req, res, next) => {
        try {
            console.log("INSIDE REGISTER : :", req.body);

            if (!req.body.email || req.body.email == '' || !req.body.email.includes('@')) {
                res.status(400).send(createResponse(400, "Invalid email", '', ''));
            };

            if (!req.body.password || req.body.password == "") {
                res.status(400).send(createResponse(400, "Password field is required", '', ''));
            } else if (req.body.password.includes(" ")) {
                res.status(400).send(createResponse(400, "Password field cannot have white spaces", '', ''));
            };

            if (!req.body.mobile || req.body.mobile == "") {
                res.status(400).send(createResponse(400, "Mobile field is required", '', ''));
            } else if (typeof req.body.mobile != "number") {
                res.status(400).send(createResponse(400, "Mobile field is invalid", '', ''));
            };

            let hashedPassword = bcrypt.hashSync(req.body.password, 10); //remove whitespaces if any

            let userObj = {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: hashedPassword,
                wallet: {
                    balance: 10000,
                    currency: "dollar"
                }
            };

            let user = await User.create(userObj).catch(err => {
                throw err
            });

            if (user) {
                console.log(user);
                let token = jwt.sign({
                    _id: user._id,
                    name: user.name
                }, process.env.SECRET_KEY, {
                    expiresIn: 86400 // expires in 24 hours
                });

                let respToSend = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    wallet: user.wallet
                }
                res.status(200).send(createResponse(200, "User registration successfull", token, respToSend));
            };
        } catch (err) {
            console.log("ERROR BIG ISSUE : : ", err);
        };
    }
};



//get data back from JSON TOKEN
// router.get('/me', function(req, res) {
    // var token = req.headers['x-access-token'];
//     // if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
//     
    // jwt.verify(token, config.secret, function(err, decoded) {
//     //   if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//       
    //   res.status(200).send(decoded);
//     // });
//   });