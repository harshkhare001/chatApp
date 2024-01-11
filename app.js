const { createServer } = require('http');
const { Server } = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');
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
const forgotPasswordRequest = require('./models/forgot-password');
const Messages = require('./models/message');
const Groups = require('./models/group');
const GroupMembers = require('./models/group-member');

const webSocketServices = require('./services/websocket');
const cronServices = require('./services/cron');
cronServices.job.start();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoute = require('./routes/user');
const forgotpasswordRoute = require('./routes/forgot-password');
const messagesRoute = require('./routes/message');
const groupRoute = require('./routes/group');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(cors({ origin: "*" }));
app.use(userRoute);
app.use(forgotpasswordRoute);
app.use(messagesRoute);
app.use(groupRoute);
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
    origin: ["https://admin.socket.io",],
    credentials: true
});
io.on('connection', webSocketServices);
instrument(io, { auth: false });

User.hasMany(forgotPasswordRequest);
forgotPasswordRequest.belongsTo(User);

User.hasMany(Messages);
Messages.belongsTo(User, { constraints: true });

User.belongsToMany(Groups, { through: GroupMembers });
Groups.belongsToMany(User, { through: GroupMembers });
Groups.belongsTo(User, { foreignKey: 'AdminId', constraints: true, onDelete: 'CASCADE' })

Groups.hasMany(Messages);
Messages.belongsTo(Groups);

async function initiate() {
    try {
        await sequelize.sync({ force: false });
        httpServer.listen(3000);
    }
    catch (err) {
        console.log(err);
    }
}
initiate();