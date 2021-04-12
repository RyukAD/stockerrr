var express = require("express");
var router = express.Router();

//get checker backend working or not
router.get("/", (req, res, next) => {
    res.send("STOCKERRR... WELCOME TO AGAMS OWN US STOCK MARKET, trading practise Application - indevelopment.")
});

module.exports = router;