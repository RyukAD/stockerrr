//hello world. start of my stock market personal project MEAN stack letsGo!

var createError = require('http-errors');
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
// var cors = require("cors")
var mongoose = require('mongoose');

var app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//connect to Db start
app["env"] = process.env.NODE_ENV || "prod"

if (app["env"] == "prod") {
    //code here for prod db connection
} else {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    mongoose.connect("mongodb://localhost/stocks", options)

    const db = mongoose.connection;

    db.on('error', err => {
        console.log("CONNECTION ERROR IN MONGOOSE: : ", err);
        process.exit()
    });
};

console.log("DB CONNECTION DONE : ");

//Db connection end

// app.use(cors());
//cors specfics
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, X-Content-Length, X-Chunks-Quantity, X-Content-Id, X-Chunk-Id, X-Content-Name, Accept, app-key, app-id, user-id, password");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

//routes start
app.use('/', require(__dirname + '/routes/index'));
app.use('/users', require(__dirname + '/routes/users/'));
app.use('/market', require(__dirname + '/routes/market/'));

//routes end

// catch 404 and forward to error handler timeTracks thumbnail
app.use(function (req, res, next) {
    console.log("error in found=====>", req._parsedUrl)
    next(createError(404));
});

app.listen(3000, () => {
    console.log("STOCKERRR : : started ...");
})

module.exports = app;