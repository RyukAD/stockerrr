//models
var User = require(__dirname + "/../../models/User")

//libs
var createResponse = require(__dirname + "/../../lib/responseObject");

module.exports = {
    updateWallet: async (req, res, next) => {
        //update wallet balance
        //this put request gives option to manually add amount to the users wallet but we will only give option to reset this to some initial value

        try {

            let token = req.headers.token

            if (!req.params.userId) {
                res.status(400).send(createResponse(400, "Invalid userId in params", "", ""));
            };
            if (req.params.userId.length != 24) {
                res.status(400).send(createResponse(400, "Invalid userId in params", "", ""));
            };
            if (!req.body) {
                res.status(400).send(createResponse(400, "No data", "", ""));
            }

            let user = await User.findById(req.params.userId).catch((e) => { throw e })

            if (user) {
                if (req.body.addMoney && req.body.addMoney > 0) {

                    let updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $inc: { "wallet.balance": req.body.addMoney } }, { new: true }).catch((e) => { throw e });

                    if (updatedUser) {
                        let respTosend = {
                            _id: updatedUser._id,
                            name: updatedUser.name,
                            email: updatedUser.email,
                            mobile: updatedUser.mobile,
                            status: updatedUser.status,
                            isVerified: updatedUser.isVerified,
                            wallet: updatedUser.wallet
                        }
                        res.send(createResponse(200, "Balance update successfull", token, respTosend))
                    };
                } else {
                    res.status.send(createResponse(401, "Malicious attempt", "", ""))
                }
            } else {
                res.status(404).send(createResponse(404, "No user found", "", ""))
            };

        } catch (e) {
            console.log("BIG ISSU IN UPDATE WALLET : ", e);
            res.status(500).send(createResponse(500, "Please try again later", "", ""));
        };
    },
    //reward point endpoint : :
}