const Sequelize = require('sequelize')

const sequelize = new Sequelize('beer', 'root', '', {
    host: "localhost",
    dialect: "mysql"
})

module.exports = sequelize
