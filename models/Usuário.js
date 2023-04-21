const database = require("./Database")
const DataTypes = require('sequelize')

const Usuario = database.define('usuarios',{
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    moedas:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
})



// Usuario.sync({force: true})


module.exports = Usuario