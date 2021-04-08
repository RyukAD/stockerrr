var mongoose = require("mongoose");

var assetSchema = new mongoose.Schema({
    alpacaId: String,
    class: String,
    exchange: String,
    symbol: String,
    name: String,
    status: String,
    tradable: String,
    marginable: String,
    shortable: String,
    easy_to_borrow: String,
    fractionable: String,
}, { timestamps: true });

assetSchema.index({ name: "text", symbol: "text" });

module.exports = mongoose.model('Assets', assetSchema);