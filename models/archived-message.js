const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const archivedMessages = sequelize.define("archivedmessages",{
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
    isImage : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
    },
    sentBy : {
        type : Sequelize.STRING,
        allowNull : false
    }

})

module.exports = archivedMessages;