var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

var userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: true },
    isVerified: { type: Boolean, default: false },
    password: String,
    status: { type: Number, default: 1 },
    stockId: [{ type: mongoose.Schema.Types.ObjectId }],
    wallet: {}
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Users', userSchema);