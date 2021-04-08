var express = require("express");
var router = express.Router();

var get = require('./get');
var post = require('./post');


//all GET requests here : : 
router.get("/", get.getUser);

//get ends

//all post requests here : :
router.post("/", post.register);
router.post("/login", post.login);


module.exports = router;