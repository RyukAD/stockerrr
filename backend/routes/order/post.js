//dependencies
const { ObjectId } = require('mongodb');

//models
var User = require(__dirname + "/../../models/User");
var Order = require(__dirname + "/../../models/Order");
var StockAnalytics = require(__dirname + "/../../models/StockAnalytics");

//from lib
var createResponse = require(__dirname + "/../../lib/responseObject");
var jwt = require(__dirname + "/../../lib/jwt");
var getData = require(__dirname + "/../../lib/makeRequest");

module.exports = {
    createOrder: async (req, res, next) => {

        console.log("ORDER BANAYENGEEEE : :");

        try {

            if (!req.body.stockName || !req.body.stockSymbol || !req.body.stockPrice || req.body.stockPrice == 0) {
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

                    //buy body
                    let orderDetails = {
                        stockName: req.body.stockName,
                        stockSymbol: req.body.stockSymbol,
                        stockId: req.body.stockId,
                        stockPrice: req.body.stockPrice,
                        type: req.body.type,
                    };

                    //move these fields inside if buy if sell according to requirement and setup validation

                    req.body.buyQty ? orderDetails['boughtQty'] = req.body.buyQty : '';
                    req.body.holdingQty ? orderDetails['holdingQty'] = req.body.holdingQty : '';
                    req.body.soldQty ? orderDetails['soldQty'] = req.body.soldQty : '';

                    //selling body
                    // let orderDetails = {
                    //     stockName: req.body.stockName,
                    //     stockSymbol: req.body.stockSymbol,
                    //     stockId: req.body.stockId,
                    //     soldQty: req.body.sellingQty,
                    //     stockPrice: req.body.stockPrice,
                    //     type: req.body.type,
                    // };
                    if (orderDetails.type && orderDetails.type == "buy") {

                        orderDetails['amount'] = orderDetails.stockPrice.toFixed(2) * orderDetails.boughtQty;
                        orderDetails['userId'] = ObjectId(user._id)

                        let createNewOrder = await Order.create(orderDetails).catch(e => {
                            throw e
                        });

                        if (createNewOrder) {

                            if ((user.wallet.balance < orderDetails['amount'])) {
                                return res.status(409).send(createResponse(409, "Balance in your account is too low to buy this buyQty of stock", token, ""));
                            };

                            let balance = user.wallet.balance - orderDetails['amount'];

                            console.log("New balance : : ", balance);

                            let updateBalance = await User.findOneAndUpdate({ _id: user._id },
                                {
                                    $set:
                                    {
                                        "wallet.balance": balance
                                    },
                                    $addToSet:
                                    {
                                        stockId: req.body.stockId
                                    }
                                }).catch(e => { throw e })

                            if (updateBalance) {

                                let stockAnalyticsObj = await StockAnalytics.findOneAndUpdate({
                                    userId: user._id,
                                    stockSymbol: req.body.stockSymbol
                                }, {
                                    $set: {
                                        userId: user._id,
                                        stockSymbol: req.body.stockSymbol,
                                        status: 1
                                    },
                                    $inc: {
                                        expenditure: orderDetails['amount'],
                                        totalQty: req.body.buyQty,
                                    }
                                }, {
                                    upsert: true,
                                    new: true
                                }).catch(e => { throw e });

                                console.log("STOCK SEED CREATED : : ", stockAnalyticsObj);

                                if (stockAnalyticsObj)
                                    return res.send(createResponse(200, "Purchase successfull", token, createNewOrder))
                            };
                        };
                    } else if (orderDetails.type && orderDetails.type == "sell") {

                        //find all buy orders before selling

                        let stockAnalyticsObj = await StockAnalytics.find({ userId: user._id, stockSymbol: orderDetails.stockSymbol }).catch(e => { throw e });

                        if (stockAnalyticsObj && stockAnalyticsObj.length > 0) {
                            if (orderDetails.soldQty > stockAnalyticsObj.totalQty) {
                                return res.status(400).send(createResponse(400, "You cannot sell more than you own.", "", ""))
                            }
                        } else {
                            return res.status(400).send(createResponse(400, "You cannot sell a stock that you do not own.", "", ""))
                        };

                        orderDetails['amount'] = orderDetails.stockPrice.toFixed(2) * orderDetails.soldQty;
                        orderDetails['userId'] = ObjectId(data._id)

                        let createNewOrder = await Order.create(orderDetails).catch(e => {
                            throw e
                        });

                        if (createNewOrder) {

                            let balance = user.wallet.balance + orderDetails['amount'];

                            console.log("New balance : : ", balance);

                            let updateBalance = await User.findOneAndUpdate({ _id: user._id }, { $set: { "wallet.balance": balance } }).catch(e => { throw e })

                            if (updateBalance) {

                                let stockAnalyticsObj = await StockAnalytics.findOneAndUpdate({
                                    userId: user._id,
                                    stockSymbol: req.body.stockSymbol
                                }, {
                                    $set: {
                                        userId: user._id,
                                        stockSymbol: req.body.stockSymbol,
                                        status: 1
                                    },
                                    $inc: {
                                        revenue: orderDetails['amount'],
                                        totalQty: -req.body.soldQty,
                                    }
                                }, {
                                    upsert: true,
                                    new: true
                                }).catch(e => { throw e });

                                if (stockAnalyticsObj) {

                                    //for reward points logic
                                    //after creating sell order calculate profit or loss
                                    //need per transaction profit loss

                                    let allOrders = await Order.find({ userId: user._id, stockSymbol: orderDetails.stockSymbol }).sort({ createdAt: 1 }); //returns array of all orders with olders to newest

                                    if (allOrders && allOrders.length) {
                                        let totalBuyPrice = 0;
                                        let count = 0;
                                        let sellingQty = orderDetails.soldQty;
                                        //now need to remove qty from buy order if buy order qty is > 0

                                        for (var k = 0; k < allOrders.length; k++) {

                                            if (
                                                allOrders[k].type == "buy" &&
                                                allOrders[k].stockSymbol == orderDetails.stockSymbol &&
                                                allOrders[k].holdingQty > 0 &&
                                                allOrders[k].holdingQty >= sellingQty
                                            ) {

                                                let updateBuyOrder = await Order.findOneAndUpdate({ _id: allOrders[k]._id }, {
                                                    $inc: {
                                                        holdingQty: -sellingQty
                                                    }
                                                }).catch(e => { throw e });

                                                if (updateBuyOrder) {
                                                    //find transaction profit / loss here
                                                    count += 1;
                                                    totalBuyPrice += (allOrders[k].stockPrice * sellingQty);

                                                    let sellingAmount = orderDetails.soldQty * orderDetails.stockPrice;
                                                    let boughtAmount = (totalBuyPrice / count).toFixed(4);

                                                    var difference = sellingAmount - boughtAmount
                                                    let updateSoldOrder = await Order.findOneAndUpdate({ _id: createNewOrder._id }, {
                                                        $set: {
                                                            PorL: difference,
                                                        }
                                                    }).catch(e => { throw e });

                                                    if (updateSoldOrder)
                                                        break
                                                }

                                            } else if (
                                                allOrders[k].type == "buy" &&
                                                allOrders[k].stockSymbol == orderDetails.stockSymbol &&
                                                allOrders[k].holdingQty > 0 &&
                                                allOrders[k].holdingQty < sellingQty
                                            ) {

                                                totalBuyPrice += (allOrders[k].stockPrice * allOrders[k].holdingQty);
                                                count += 1;

                                                let updateBuyOrder = await Order.findOneAndUpdate({ _id: allOrders[k]._id }, {
                                                    $inc: {
                                                        holdingQty: -allOrders[k].holdingQty
                                                    }
                                                }).catch(e => { throw e });

                                                if (updateBuyOrder) {
                                                    sellingQty -= allOrders[k].holdingQty
                                                    continue
                                                };

                                            } else if (allOrders[k].status != 0) {
                                                let updateBuyOrder = await Order.findOneAndUpdate({ _id: allOrders[k]._id }, {
                                                    $set: {
                                                        status: 0
                                                    }
                                                }).catch(e => { throw e })
                                                continue
                                            };
                                        };
                                    };

                                    //reward point logic ere give me rewards please.
                                    //give 30% of any profit made as reward point

                                    //check if difference is positive

                                    let updateRewardPoints = await User.findOneAndUpdate({ _id: user._id },
                                        {
                                            $inc:
                                            {
                                                "wallet.rewardPoints": difference >= 0 ? (difference * 0.10) : 0
                                            }
                                        }).catch(e => { throw e });

                                    if (updateRewardPoints) {
                                        return res.send(createResponse(200, "Sold successfully", token, createNewOrder));
                                    };
                                };

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