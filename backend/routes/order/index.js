var express = require("express");
var router = express.Router();

var get = require('./get');
var post = require('./post');
// var put = require('./put');

router.post("/", post.createOrder);
router.get("/", get.getOrders);
router.get("/:orderId", get.getOrder);


module.exports = router;