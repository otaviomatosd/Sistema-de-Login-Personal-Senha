const {DataTypes} = require("sequelize");
const sequelize = require("../database/connection.js");

const Usuario = sequelize.define("Usuario",{
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false
    },
    personal:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    }
});

Usuario.sync({force: false})
.then(() => {
    console.log("Tabela Criada");
}).catch((err => {
    console.error("Tabela não criada", err);
}));

module.exports = Usuario;