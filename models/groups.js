const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Groups = sequelize.define("groups",{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    name :{
        type : Sequelize.STRING,
        unique : true,
        allowNull : false
    }
})

module.exports = Groups;