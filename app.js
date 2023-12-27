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

const User = require('./models/user');
const forgotPasswordRequest = require('./models/forgotpasswordrequest');
const Messages = require('./models/message');
const Groups = require('./models/groups');
const GroupMembers = require('./models/group-members');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoute = require('./routes/user');
const forgotpasswordRoute = require('./routes/forgotpassword');
const messagesRoute = require('./routes/messages');
const groupRoute = require('./routes/group');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags : 'a'})

app.use(cors({origin : "*"}));
app.use(userRoute);
app.use(forgotpasswordRoute);
app.use(messagesRoute);
app.use(groupRoute);
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream : accessLogStream}));

User.hasMany(forgotPasswordRequest);
forgotPasswordRequest.belongsTo(User);

User.hasMany(Messages);
Messages.belongsTo(User, { constraints: true });

User.belongsToMany(Groups, {through : GroupMembers});
Groups.belongsToMany(User, {through : GroupMembers});
Groups.belongsTo(User, {foreignKey: 'AdminId', constraints:true, onDelete:'CASCADE'})

Groups.hasMany(Messages);
Messages.belongsTo(Groups);

sequelize.sync({force:false}).then((result)=>app.listen(3000)).catch((err)=>console.log(err));