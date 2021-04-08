// const Alpaca = require("@alpacahq/alpaca-trade-api");
// const WebSocket = require('ws');
//dependencies
var axios = require("axios")

//models
var Asset = require(__dirname + "/../../models/Asset")

//from lib
var createResponse = require(__dirname + "/../../lib/responseObject");
var jwt = require(__dirname + "/../../lib/jwt");

//to get data for all

module.exports = {
    getMarketData: async (req, res, next) => {
        console.log("HELLO WORLD MARKET");

        try {
            let token = req.headers.token

            let tokenData = await jwt.getData(token);

            if (tokenData) {

                console.log("TOKEN TRUE : : ", tokenData);

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

                } else {
                    console.log("NO ASSET FOUND : : :");
                    res.status(400).send(createResponse(400, "Asset not found", "", ""))
                }

            } else {
                console.log(tokenData);
                res.status(401).send(createResponse(401, "Invalid token / token expired", "", ""))
            }


        } catch (err) {
            console.log("ERROR IN GET MARKET DATA : : ", err);
        }
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
    }
}