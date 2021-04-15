var express = require("express");
var router = express.Router();

var get = require('./get');
var post = require('./post');
var put = require('./put');


//all GET requests here : : 
// router.get("/", get.calculate); //calculate the profit or loss user is going to make on a stock owned by user

//get ends

//all post requests here : :
router.post("/", post.register);
router.post("/login", post.login);

//put requests
router.put("/:userId/wallet", put.updateWallet);


module.exports = router;