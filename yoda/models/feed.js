const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
    _id: mongoose.ObjectId,
    event: {
        source: String,
        date: Date,
        description: String,
    },
    feed: String,
}, { timestamps: true });

const Feeds = mongoose.model("Feeds", feedSchema);
module.exports = { Feeds }
