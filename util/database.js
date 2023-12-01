const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('chat-app', 'root', 'hulk@123', {dialect:'mysql', host : 'localhost'});

module.exports = sequelize;