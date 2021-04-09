var express = require("express");
var router = express.Router();

// var get = require('./get');
var post = require('./post');
// var put = require('./put');

router.post("/", post.createOrder)


module.exports = router;