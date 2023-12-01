const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const sequelize = require('./util/database');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoute = require('./routes/user');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags : 'a'})

app.use(cors());
app.use(userRoute);
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream : accessLogStream}));

sequelize.sync({force:false}).then((result)=>app.listen(3000)).catch((err)=>console.log(err));