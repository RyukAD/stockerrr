//dependencies
const { ObjectId } = require('mongodb');

//models
var User = require(__dirname + "/../../models/User");
var Order = require(__dirname + "/../../models/Order");

//from lib
var createResponse = require(__dirname + "/../../lib/responseObject");
var jwt = require(__dirname + "/../../lib/jwt");
var getData = require(__dirname + "/../../lib/makeRequest");

module.exports = {
    createOrder: async (req, res, next) => {

        console.log("ORDER BANAYENGEEEE : :");

        try {

            if (!req.body.stockName || !req.body.stockSymbol || !req.body.qty || req.body.qty == 0 || !req.body.stockPrice || req.body.stockPrice == 0) {
                return res.status(400).send(createResponse(400, "Invalid request", "", ""))
            };

            var token = req.headers.token;

            var data = await jwt.getData(token);

            if (data) {

                console.log("DECODED TOKEN : :", data, data._id);

                let user = await User.findOne({ _id: data._id }).catch(e => {
                    throw e
                });

                if (user) {

                    console.log("USER FOUND : : ", user);

                    let orderDetails = {
                        stockName: req.body.stockName,
                        stockSymbol: req.body.stockSymbol,
                        qty: req.body.qty,
                        stockPrice: req.body.stockPrice,
                        type: req.body.type,
                    };

                    if (orderDetails.type && orderDetails.type == "buy") {

                        orderDetails['amount'] = orderDetails.stockPrice.toFixed(2) * orderDetails.qty;
                        orderDetails['userId'] = ObjectId(user._id)

                        let createNewOrder = await Order.create(orderDetails).catch(e => {
                            throw e
                        });

                        if (createNewOrder) {

                            if ((user.wallet.balance < orderDetails['amount'])) {
                                return res.status(409).send(createResponse(409, "Balance in your account is too low to buy this qty of stock", token, ""));
                            };

                            let balance = user.wallet.balance - orderDetails['amount'];

                            console.log("New balance : : ", balance);

                            let updateBalance = await User.findOneAndUpdate({ _id: user._id }, { $set: { "wallet.balance": balance } }).catch(e => { throw e })

                            if (updateBalance) {
                                return res.send(createResponse(200, "Purchase successfull", token, createNewOrder))
                            };
                        };
                    } else if (orderDetails.type && orderDetails.type == "sell") {

                        //find all buy orders before selling

                        let buyOrders = await Order.find({ userId: user._id, type: "buy", stockSymbol: orderDetails.stockSymbol }).catch(e => { throw e });
                        var totalQtyOfStock = 0;

                        if (buyOrders) {
                            buyOrders.forEach((order) => {
                                totalQtyOfStock += order.qty;
                            });
                        };

                        if(orderDetails.qty > totalQtyOfStock){
                            return res.status(400).send(createResponse(400, "You cannot sell more than you own.", "", ""))
                        }

                        orderDetails['amount'] = orderDetails.stockPrice.toFixed(2) * orderDetails.qty;
                        orderDetails['userId'] = ObjectId(data._id)

                        let createNewOrder = await Order.create(orderDetails).catch(e => {
                            throw e
                        });

                        if (createNewOrder) {

                            let balance = user.wallet.balance + orderDetails['amount'];

                            console.log("New balance : : ", balance);

                            let updateBalance = await User.findOneAndUpdate({ _id: user._id }, { $set: { "wallet.balance": balance } }).catch(e => { throw e })

                            if (updateBalance) {
                                return res.send(createResponse(200, "Purchase successfull", token, createNewOrder))
                            };
                        };
                    } else {
                        return res.status(400).send(createResponse(400, "Invalid order type", "", ""))
                    };
                } else {

                    return res.status(404).send(createResponse(400, "User does not exists", "", ""))
                }
            };
        } catch (e) {
            console.log("HUGE PROBLEM IN CREATING ORDER : ", e);
            //look for a logger to log error messages: : : : :
            return res.status(500).send(createResponse(500, "PROBLEM IN CREATING ORDER. TRY AGAIN AFTER SOMETIME", "", ""))
        };
    }
};