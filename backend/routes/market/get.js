// const Alpaca = require("@alpacahq/alpaca-trade-api");
// const WebSocket = require('ws');
//dependencies
// var stockPrice = require("yahoo-stock-prices")

//models
var Asset = require(__dirname + "/../../models/Asset")

//from lib
var createResponse = require(__dirname + "/../../lib/responseObject");
var jwt = require(__dirname + "/../../lib/jwt");
var getData = require(__dirname + "/../../lib/makeRequest");

//to get data for specific stock

module.exports = {
    getMarketData: async (req, res, next) => {
        console.log("GET MARKET DATA GET.JS MARKET");

        try {

            let token = req.headers.token;

            let tokenData = await jwt.getData(token);

            if (tokenData) {

                console.log("TOKEN TRUE : : ", tokenData);

                if (!req.params.stock || req.params.stock.length < 3) {
                    res.status(400).send(createResponse(200, "Invalid stock", "", ""));
                };

                console.log("REQUESTED TRADE : : ", req.params.stock);

                let queryObj = {
                    "$text": {
                        "$search": req.params.stock
                    }
                };

                let asset = await Asset.findOne(queryObj).catch(err => {
                    throw err
                });

                if (asset) {
                    console.log("ASSET MILA REE : : ", asset);
                    //axios code here - hit alpaca api and get info
                    // const alpaca = new Alpaca({
                    //     keyId: process.env.API_ID,
                    //     secretKey: process.env.API_KEY,
                    //     paper: true,
                    //     usePolygon: false
                    // });

                    //get prices for given symbol
                    // alpaca.lastQuote(asset.symbol).then((data) => {
                    //     console.log("DATA PAYO : :", data);
                    // })

                    var url = "https://financialmodelingprep.com/api/v3/quote/" + asset.symbol + "?apikey=" + process.env.FMP_KEY;

                    let marketObj = await getData(url);

                    if (marketObj && marketObj.length > 0) {
                        console.log(marketObj);
                        var respToSend = {
                            name: marketObj[0].name ? marketObj[0].name : '',
                            currentPrice: marketObj[0].price ? marketObj[0].price : '',
                            percentageChange: marketObj[0].changesPercentage ? marketObj[0].changesPercentage : '',
                            priceChange: marketObj[0].change ? marketObj[0].change : '',
                            previousClose: marketObj[0].previousClose ? marketObj[0].previousClose : '',
                            openPrice: marketObj[0].openPrice ? marketObj[0].openPrice : '',
                            todayLow: marketObj[0].dayLow ?  marketObj[0].dayLow : '',
                            todayHigh: marketObj[0].dayHigh ? marketObj[0].dayHigh : '',
                            thisYearHigh: marketObj[0].yearHigh ? marketObj[0].yearHigh : '',
                            thisYearLow: marketObj[0].yearLow ? marketObj[0].yearLow : '',
                            exchange: marketObj[0].exchange ? marketObj[0].exchange : ''
                        };
                        res.status(200).send(createResponse(200, "Success", token, respToSend));
                    } else {
                        res.status(400).send(createResponse(200, "No market data found for given stock", "", ""));
                    };
                    //sample data from fmp api for stock data : :
                    //                 [ { symbol: 'AMZN',
                    // name: 'Amazon.com, Inc.',
                    // price: 3299.3,
                    // changesPercentage: 0.61,
                    // change: 19.91,
                    // dayLow: 3292,
                    // dayHigh: 3324.5,
                    // yearHigh: 3552.25,
                    // yearLow: 2038,
                    // marketCap: 1661412048896,
                    // priceAvg50: 3109.5354,
                    // priceAvg200: 3176.6963,
                    // volume: 2812090,
                    // avgVolume: 3588340,
                    // exchange: 'NASDAQ',
                    // open: 3310.9,
                    // previousClose: 3279.39,
                    // eps: 41.83,
                    // pe: 78.87401,
                    // earningsAnnouncement: '2021-02-02T16:03:00.000+0000',
                    // sharesOutstanding: 503565013,
                    // timestamp: 1617951925 } ]

                    //get previous days closing price
                    // console.log(date, month, year);
                    // const historicalPrice = await stockPrice.getHistoricalPrices(month, date - 2, year, month, date - 1, year, asset.symbol, '1d');
                    // if (historicalPrice) {
                    //     console.log(historicalPrice);
                    //     var closePrice = historicalPrice[0].close.toFixed(3);
                    // }


                    // const price = await stockPrice.getCurrentData(asset.symbol);
                    // if (price) {
                    //     console.log(price);
                    //     var percentageChange = 
                    // }
                    // let resp = alpaca.getBarsV2(
                    //     "AAPL",
                    //     {
                    //         start: "2021-04-07",
                    //         end: "2021-04-08",
                    //         // limit: 2,
                    //         timeframe: "1Day",
                    //         adjustment: "all",
                    //     },
                    //     alpaca.configuration
                    // );
                    // const bars = [];

                    // for await (let b of resp) {
                    //     console.log(b)
                    // }



                } else {
                    console.log("NO ASSET FOUND : : :");
                    res.status(400).send(createResponse(400, "Asset not found", "", ""))
                };

            } else {
                console.log(tokenData);
                res.status(401).send(createResponse(401, "Invalid token / token expired", "", ""))
            };


        } catch (err) {
            console.log("ERROR IN GET MARKET DATA : : ", err);
        }

        //using websocket for real time data : : : :
        // "use strict";

        // /**
        //  * This examples shows how to use tha alpaca data v2 websocket to subscribe to events.
        //  * You should use the alpaca api's data_steam_v2, also add feed besides the other parameters.
        //  * For subscribing (and unsubscribing) to trades, quotes and bars you should call
        //  * a function for each like below.
        //  */
        // // const API_KEY = "<YOUR_API_KEY>";
        // // const API_SECRET = "<YOUR_API_SECRET>";

        // const url = 'wss://stream.data.alpaca.markets/v2/iex'



        // const ws = new WebSocket(url);

        // ws.on('open', function open() {
        //     var obj = { "action": "auth", "key": process.env.API_ID, "secret": process.env.API_KEY }
        //     console.log('connected');
        //     ws.send(JSON.stringify(obj));
        //     ws.send(JSON.stringify({"action":"subscribe","bars":["*"]}));
        //     // {"action":"subscribe","trades":["AAPL"],"quotes":["AMD","CLDR"],"bars":["AAPL","VOO"]}
        // });

        // ws.on('connect', function connect() {
        //     console.log("CONNECTED BROOO");
        // })


        // ws.on('message', function incoming(data) {
        //     console.log("FROM MESSAGE : :",data);
        // });

        // const connection = new WebSocket(url)

        // connection.onopen = () => {
        //     var obj = { "action": "auth", "key": process.env.API_ID, "secret": process.env.API_KEY }
        //     connection.send(obj)
        // }

        // connection.onmessage = e => {
        //     console.log(e.data)
        // }

        // class DataStream {
        //     constructor({ apiKey, secretKey, feed, paper }) {
        //         this.alpaca = new Alpaca({
        //             keyId: apiKey,
        //             secretKey,
        //             feed,
        //             paper
        //         });

        //         const socket = this.alpaca.data_stream_v2;

        //         socket.onConnect(function () {
        //             console.log("Connected");
        //             // socket.subscribeForQuotes(["Q.SNDL"]);
        //             socket.subscribeForTrades(['T.AAPL']);
        //             socket.subscribeForBars(["AM.AAPL"]);
        //         });

        //         socket.onError((err) => {
        //             console.log("FROM ERROR : : ",err);
        //         });

        //         socket.onStockTrade((trade) => {
        //             console.log(trade);
        //         });

        //         socket.onStockQuote((quote) => {
        //             console.log(quote);
        //         });

        //         socket.onStockBar((bar) => {
        //             console.log(bar);
        //         });

        //         socket.onStateChange((state) => {
        //             console.log(state);
        //         });

        //         socket.onDisconnect(() => {
        //             console.log("Disconnected");
        //         });

        //         socket.connect();
        //     }
        // }

        // let stream = new DataStream({
        //     apiKey: process.env.API_ID,
        //     secretKey: process.env.API_KEY,
        //     feed: "iex",
        //     paper: true,
        // });

        // console.log(stream);

        // res.status(200).send("OK")
    },
    profileData: async (req, res, next) => {
        console.log("INSIDE PROFILE DATA");

        if (!req.params.stock || req.params.stock.length < 3) {
            res.status(400).send(createResponse(200, "Invalid stock", "", ""));
        }
        try {

            let token = req.headers.token;

            let tokenData = await jwt.getData(token);

            if (tokenData) {

                console.log("REQUESTED TRADE : : ", req.params.stock);

                let queryObj = {
                    "$text": {
                        "$search": req.params.stock
                    }
                };

                let asset = await Asset.findOne(queryObj).catch(err => {
                    throw err
                });

                if (asset) {

                    console.log(asset);

                    var url = "https://financialmodelingprep.com/api/v3/profile/" + asset.symbol + "?apikey=" + process.env.FMP_KEY;

                    let marketObj = await getData(url);

                    if (marketObj && marketObj.length > 0) {
                        console.log("GOT DATA : :", marketObj);

                        let respToSend = {
                            symbol: marketObj[0].symbol ? marketObj[0].symbol : '',
                            marketCap: marketObj[0].mktCap ? marketObj[0].mktCap : '',
                            companyName: marketObj[0].companyName ? marketObj[0].companyName : '',
                            currency: marketObj[0].currency ? marketObj[0].currency : '',
                            exchange: marketObj[0].exchange ? marketObj[0].exchange : '',
                            exchangeShortName: marketObj[0].exchangeShortName ? marketObj[0].exchangeShortName : '',
                            industry: marketObj[0].industry ? marketObj[0].industry : '',
                            website: marketObj[0].website ? marketObj[0].website : '',
                            description: marketObj[0].description ? marketObj[0].description : '',
                            ceo: marketObj[0].ceo ? marketObj[0].ceo : '',
                            sector: marketObj[0].sector ? marketObj[0].sector : '',
                            country: marketObj[0].country ? marketObj[0].country : '',
                            fullTimeEmployees: marketObj[0].fullTimeEmployees ? marketObj[0].fullTimeEmployees : '',
                            phone: marketObj[0].phone ? marketObj[0].phone : '',
                            address: marketObj[0].address ? marketObj[0].address : '',
                            city: marketObj[0].city ? marketObj[0].city : '',
                            state: marketObj[0].state ? marketObj[0].state : '',
                            zip: marketObj[0].zip ? marketObj[0].zip : '',
                            image: marketObj[0].image ? marketObj[0].image : ''
                        }

                        res.send(createResponse(200, "Success", token, respToSend))
                    } else {
                        res.status(400).send(createResponse(400, "We currently do not have data for this stock. check back later", "", ""))
                    };
                } else {
                    console.log("NO ASSET FOUND : : :");
                    res.status(400).send(createResponse(400, "Asset not found", "", ""))
                };
            } else {
                console.log(tokenData);
                res.status(401).send(createResponse(401, "Invalid token / token expired", "", ""))
            };

        } catch (e) {
            console.log("HUGE PROBLEM inside PROFILE DATA : :", e);
        };
    }
}