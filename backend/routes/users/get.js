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
    calculate: async (req, res, next) => {

        console.log("CALCULATE USER PROFITS OR LOSSES : :");

        try {
            var token = req.headers.token;

            var data = await jwt.getData(token);

            if (data) {

                console.log("DECODED TOKEN : :", data, data._id);

                let user = await User.findOne({ _id: data._id }).catch(e => {
                    throw e
                });

                if (user) {

                    let allOrders = await Order.find({ userId: user._id }).catch(e => { throw e });

                    console.log("ALL ORDERS : :", allOrders, "LENGTH  : : : ", allOrders.length);

                    var resultArr = [];

                    if (allOrders) {

                        var compare = 0; //get the difference values in this variable
                        var percentageChange = 0; //total amount spent on a stock

                        //loop through all orders of the logged in user
                        for (var i = 0; i < allOrders.length; i++) {

                            if (allOrders[i].type == "buy") { //only if type of order was buy proceed

                                if (i == 0) { //on first iteration set the resultArr with first companies details

                                    var url = "https://financialmodelingprep.com/api/v3/quote/" + allOrders[i].stockSymbol + "?apikey=" + process.env.FMP_KEY;

                                    var stockData = await getData(url);

                                    console.log("BACK FROM LIB : :", stockData);

                                    if (stockData && stockData.length) {

                                        // console.log("COMPARING : :");

                                        compare += (stockData[0].price * allOrders[i].qty) - allOrders[i].amount;
                                        percentageChange += (compare / allOrders[i].amount).toFixed(2) * 100

                                        resultArr.push({
                                            symbol: allOrders[i].stockSymbol,
                                            gainLoss: compare,
                                            percentageChange: percentageChange
                                        });

                                        console.log("AFTER PUSH TO ARR : : : WHEN I = 0", resultArr);

                                        // console.log("AFTER COMPARE FIRST TIME I =", i, " compare val : :", compare);

                                    } else {//return if no data from api finanicalmodelprep
                                        return res.status(404).send(createResponse(404, "NO STOCK WITH GIVEN TICKER" + allOrders[i].stockSymbol, "", ""));

                                    };
                                } else if (allOrders[i].stockSymbol == allOrders[i - 1].stockSymbol) {//if last order symbol was same as current order symbol, update the difference on same array object

                                    // console.log("SAME STOCK : : ", allOrders[i].stockSymbol, "  : : ", allOrders[i - 1].stockSymbol);

                                    if (stockData && stockData.length) {
                                        // console.log("COMPARING : :");
                                        // compare += (stockData[0].price * allOrders[i].qty) - allOrders[i].amount;
                                        // amount += allOrders[i].amount;

                                        let index = resultArr.findIndex((object) => { return object.symbol == allOrders[i].stockSymbol });

                                        resultArr[index]["gainLoss"] += (stockData[0].price * allOrders[i].qty) - allOrders[i].amount;
                                        resultArr[index]["percentageChange"] += (((stockData[0].price * allOrders[i].qty) - allOrders[i].amount) / allOrders[i].amount).toFixed(2) * 100;

                                        // console.log("UPDATE GAIN LOSS IN RESULTARR : : ", resultArr);

                                    } else {
                                        return res.status(404).send(createResponse(404, "NO STOCK WITH GIVEN TICKER" + allOrders[i].stockSymbol, "", ""));
                                    };
                                } else {//stock ticker different from previous ticker then check if it already exist in result arr

                                    compare = 0;

                                    // console.log("NEW STOCK : : ", allOrders[i].stockSymbol);

                                    var url = "https://financialmodelingprep.com/api/v3/quote/" + allOrders[i].stockSymbol + "?apikey=" + process.env.FMP_KEY;

                                    var stockData = await getData(url);

                                    // console.log("BACK FROM LIB NEW STOCK : :", stockData);

                                    if (stockData && stockData.length) {

                                        // console.log("COMPARING : : SHOULD BE 0 : : ", compare);

                                        compare += (stockData[0].price * allOrders[i].qty) - allOrders[i].amount;
                                        percentageChange += (compare / allOrders[i].amount).toFixed(2) * 100;

                                        resultArr.forEach((info) => {//if already exists update gain loss
                                            let valuesOfStockInfo = Object.values(info);
                                            if (valuesOfStockInfo.includes(allOrders[i].stockSymbol)) {
                                                info['gainLoss'] += (stockData[0].price * allOrders[i].qty) - allOrders[i].amount;
                                                info["percentageChange"] += percentageChange;
                                            };

                                        });

                                        // console.log("RESULT ARR : : BEFORE INDEX FINDING : : ", resultArr);

                                        //else create a new entry in result array
                                        let index = resultArr.findIndex((object) => object.symbol == allOrders[i].stockSymbol);

                                        // console.log("INDEXX OF FOUND : : ", index);

                                        if (index == -1) {

                                            resultArr.push({
                                                symbol: allOrders[i].stockSymbol,
                                                gainLoss: compare,
                                                percentageChange: percentageChange
                                            });
                                        };

                                        // console.log("AFTER PUSH TO ARR : : : WHEN I = ", i, " RESULT ARR :  :", resultArr);

                                        // console.log("AFTER COMPARE NEW STOCK I =", i, " compare val : :", compare);

                                    } else {
                                        return res.status(404).send(createResponse(404, "NO STOCK WITH GIVEN TICKER" + allOrders[i].stockSymbol, "", ""));
                                    };
                                }
                            } else {
                                console.log("I KI VALUE IS : : ", i, " : sell aagya : :", allOrders[i].type);
                                continue
                            };
                        };
                        //find total amount spent on each ticker to find the %gain or loss
                        console.log("FINAL : : RESULT ARR : : ", resultArr);
                        return res.send(createResponse(200, "Success", token, resultArr));
                        
                    } else {
                        return res.status(404).send(createResponse(404, "No orders found", "", ""))
                    };
                } else {
                    return res.status(404).send(createResponse(404, "User does not exists", "", ""));
                };
            };
        } catch (e) {
            console.log("BIG ERROR IN CALCULATE INSIDE USER GET: :", e);
            return res.status(500).send(createResponse(500, "TRY AGAIN AFTER SOMETIME", "", ""));
        };
    }
}