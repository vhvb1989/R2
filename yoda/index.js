const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose")

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const { Events } = require("./models/event.js")

// ---------------------------------------------------- SET UP ----------------------------------
const port = process.env.PORT || 5000;

const app = express();
app.use(morgan("dev"));
app.use(
    express.json({
        limit: "50mb",
    })
);

// Open CORS - for demo purpose only
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.get("/events", async (req, res) => {
    const events = await Events.find();
    res.status(200).json({ events });
});

const mockedFeed = require('./mockedFeed.json')
app.get("/feed", async (req, res) => {
    res.status(200).json({ feed: mockedFeed });
});

// use the req payload to reset db
app.post("/reset/feed", async (req, res) => {
    // call padme service
    // result = padme-url/generate

    // save result in DB
});


// use the req payload to reset db
app.post("/reset/naboo/events", async (req, res) => {
    // delete events
    await Events.deleteMany({});

    const requestEvents = req.body
    for (const event of requestEvents) {
        const row = new Events();
        row._id = new mongoose.Types.ObjectId();
        row.title = event.title;
        row.date = event.date;
        row.description = event.description;
        row.source = event.source;
        await row.save();
    }
    const result = await Events.find();
    res.status(200).json({ result });
});

// ---------------------------------------------------- START ----------------------------------
console.log(`Connection to DB:`);
const connectDB = async () => {

    const keyVaultUrl = process.env.AZURE_KEY_VAULT_ENDPOINT;
    const kvClient = new SecretClient(keyVaultUrl, new DefaultAzureCredential());
    const r2NabooConnectionSecret = process.env.AZURE_COSMOS_CONNECTION_STRING_KEY;
    const r2NabooConnection = await kvClient.getSecret(r2NabooConnectionSecret);

    await mongoose.connect(r2NabooConnection.value, {
        authSource: "admin",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log("Db connected.");
};

connectDB().then(() => {
    var db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));

    app.listen(port, () => {
        console.log("Listening on port " + port);
    });
});

module.exports = app;
