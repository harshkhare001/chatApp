const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Groupmembers = sequelize.define('groupMembers',{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    }
});

module.exports = Groupmembers;