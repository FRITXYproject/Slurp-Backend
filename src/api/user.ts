export { };

const express = require("express");
const app = express.Router();
const functions = require("../structs/functions.js");

const { verifyApikey } = require("../utilities/api.js");
const User = require("../model/user.js");
const Api = require("../model/api.js");



app.get("/api/user/:key/:value", verifyApikey, (req, res) => {

    const { key } = req.params;
    const { value } = req.params;

    const query = {};
    query[key] = value;

    User.findOne(query, { password: 0, _id: 0 }, (err, user) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (!user) return res.status(404).json({ error: "User not found" });

        user.password = "[REDACTED]";

        res.status(200).json(user);
    });

});

app.post("/api/user/:key/:value", verifyApikey, (req, res) => {

    const { key } = req.params;
    const { value } = req.params;

    const body = req.body;

    const fieldToUpdate = body.fieldToUpdate;
    const newValue = body.newValue;

    const query = {};
    query[key] = value;

    const update = {};
    update[fieldToUpdate] = newValue;

    User.findOneAndUpdate(query, update, { new: true }, (err, user) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (!user) return res.status(404).json({ error: "User not found" });

        user.password = "[REDACTED]";

        res.status(200).json(user);
    });

});


module.exports = app;
