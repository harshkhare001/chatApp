const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Messages = sequelize.define("messages",{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    text : {
        type : Sequelize.STRING,
        allowNull : false
    },
    sentBy : {
        type : Sequelize.STRING,
        allowNull : false
    }

})

module.exports = Messages;
