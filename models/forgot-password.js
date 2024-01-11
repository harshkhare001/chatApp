const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ForgotPasswordRequest = sequelize.define("forgotPasswordRequest",{
    id:{
        type : Sequelize.STRING,
        primaryKey : true,
        allowNull : false
    },
    isactive :{
        type : Sequelize.BOOLEAN
    }
});

module.exports = ForgotPasswordRequest;