const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize("usuarios","root","anakin", {
    host:"localhost",
    dialect:"mysql"
});

sequelize.authenticate()
.then(() => {
    console.log("Banco de dados funcionando");
}).catch((error) => {
    console.log("Banco não está funcionando");
});

module.exports = sequelize;