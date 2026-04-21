const express = require("express");
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const router = require("./Router/router.js");

const app = express();
const saltRounds = 10;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/usuarios", router);

app.get("/", (req,res) => {
    res.send("Funcionando")
});

app.listen(3000, () => {
    console.log("Servidor Funcionando");
});