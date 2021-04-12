var mongoose = require("mongoose");

var stockAnalyticsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    stockSymbol: String,
    expenditure: Number,
    status: { type: Number, default: 1 },
    totalQty: Number,
    revenue: Number
}, { timestamps: true });

stockAnalyticsSchema.index({ symbol: "text" });

module.exports = mongoose.model('StockAnalytics', stockAnalyticsSchema);