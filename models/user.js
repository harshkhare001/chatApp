const Sequelize = require('sequelize');

const sequelize = require('../util/database')

const Users = sequelize.define("users",{
        id:{
            type : Sequelize.STRING,
            primaryKey : true,
            allowNull : false
        },
        phone:{
            type : Sequelize.STRING,
            allowNull : false
        },
        name:{
            type : Sequelize.STRING,
            allowNull : false
        },
        password:{
            type : Sequelize.STRING,
            allowNull : false
        },
        loggedIn:{
            type : Sequelize.BOOLEAN,
            defaultValue : 0
        }
    });

module.exports = Users;