var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    email: { type : String, required: true },
    mobile: { type : Number, required: true },
    password: String,
    wallet: {}
});

module.exports = mongoose.model('Users', userSchema);