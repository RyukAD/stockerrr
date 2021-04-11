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
    getOrders: async (req, res, next) => {

        console.log("GET ALL ORDERS FOR ONE USER");

        try {
            //not neccessary token will have the id of the user
            // if (!req.query.userId) {
            //     return res.status(400).send(createResponse(400, "Please pass a userId in query", "", ""));
            // } else if ((req.query.userId + '').length != 24) {
            //     return res.status(400).send(createResponse(400, "Please pass a valid userId in query", "", ""));
            // };

            var token = req.headers.token;

            var data = await jwt.getData(token)

            if (data) {
                console.log("DECODED TOKEN : :", data, data._id);

                let user = await User.findOne({ _id: data._id }).catch(e => {
                    throw e
                });

                if (user) {
                    let allOrders = await Order.find({ userId: data._id }).catch(e => {
                        throw e
                    })
                    if (allOrders) {
                        return res.status(200).send(createResponse(200, "Success", token, allOrders));
                    } else {
                        return res.status(404).send(createResponse(404, "No orders found. Please place an order", "", ""));
                    };
                } else {
                    return res.status(400).send(createResponse(400, "User not found", "", ""));
                };
            };
        } catch (e) {
            console.log("BIG ISSUE IN GET ALL ORDERS : :", e);
            return res.status(500).send(createResponse(500, "PLEASE TRY AGAIN AFTER SOME TIME", "", ""));
        };
    },

    getOrder: async (req, res, next) => {

        try {

            console.log("GET ONE ORDER FOR ONE USER : : ", req.params.orderId);

            var token = req.headers.token;

            var data = await jwt.getData(token)

            if (data) {
                console.log("DECODED TOKEN : :", data, data._id);

                if (req.params.orderId && req.params.orderId.length == 24) {

                    let user = await User.findOne({ _id: data._id }).catch(e => {
                        throw e
                    });

                    if (user) {
                        let order = await Order.findOne({ _id: ObjectId(req.params.orderId), userId: data._id }).catch(e => {
                            throw e
                        })
                        if (order) {
                            return res.status(200).send(createResponse(200, "Success", token, order));
                        } else {
                            return res.status(404).send(createResponse(404, "No orders found. Please place an order", "", ""));
                        };
                    } else {
                        return res.status(400).send(createResponse(400, "User not found", "", ""));
                    };
                } else {
                    return res.status(400).send(createResponse(400, "Invalid Order Id", "", ""));
                };
            };

        } catch (e) {

            console.log("BIG ISSUE IN GET ONE ORDERS : :", e);
            return res.status(500).send(createResponse(500, "PLEASE TRY AGAIN AFTER SOME TIME", "", ""));

        };
    }
};