const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    _id: mongoose.ObjectId,
    title: String,
    date: Date,
    description: String,
    source: String,
}, { timestamps: true });

const Events = mongoose.model("Events", eventSchema);
module.exports = { Events }
