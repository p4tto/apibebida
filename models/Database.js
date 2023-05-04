const Sequelize = require('sequelize')

const sequelize = new Sequelize('beer', 'root', 'toor', {
    host: "localhost",
    dialect: "mysql",
})

module.exports = sequelize
