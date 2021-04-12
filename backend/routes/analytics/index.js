//get live market data from alpaca api

var express = require("express");
var router = express.Router();

var get = require("./get");

router.get("/", get.getAnalyticsData); //get market data for specific stock
// router.get("/", get.profileData); //get company data for specific stock

module.exports = router;