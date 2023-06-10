const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
    _id: mongoose.ObjectId,
    title: String,
    date: Date,
    description: String,
    source: String,
    createdAt: Date,
    updatedAt: Date,
    _v: Number,
    conversation:[{role: String, content: String}],
}, { timestamps: true });

const Feeds = mongoose.model("Feeds", feedSchema);
module.exports = { Feeds }
