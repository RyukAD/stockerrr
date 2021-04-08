//get live market data from alpaca api

var express = require("express");
var router = express.Router();

var get = require("./get");

router.get("/:stock", get.getMarketData); //get market data for specific stock

module.exports = router;