const express = require("express");
const morgan = require("morgan");

// ---------------------------------------------------- SET UP ----------------------------------
const port = process.env.PORT || 5000;

const app = express();
app.use(morgan("dev"));
app.use(
    express.json({
        limit: "50mb",
    })
);

app.get("/events", async (req, res) => {
    res.status(200).json({ items: "hello" });
});

module.exports = app;

app.listen(port, () => {
    console.log("Listening on port " + port);
});
