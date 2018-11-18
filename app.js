const config = require("./config.json");
const fs = require("fs");
const express = require("express");
const app = express();

const files = fs.readdirSync("./endpoints");
const endpoints = {};

files.forEach((file) => {
    let name = file.split(".")[0];
    endpoints[name] = require(`./endpoints/${file}`);
    app[endpoints[name].method](endpoints[name].route, endpoints[name].handle);
});

app.listen(config.port, () => {
    console.log(`listening on ${config.port}`);
});
