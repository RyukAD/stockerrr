var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    stockName: String,
    stockSymbol: String,
    stockPrice: { type: Number, required: true },
    status: { type: Number, default: 1 },
    type: String, //type of order buy stock or sell stock
    boughtQty: { type: Number },
    soldQty: { type: Number },
    holdingQty: { type: Number }
}, { timestamps: true });

orderSchema.index({ stockName: "text", symbol: "text" });

module.exports = mongoose.model('Orders', orderSchema);