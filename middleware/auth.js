const jwt = require('jsonwebtoken');

const Users = require('../models/user');

exports.authenticate = (req, res, next)=>
{
    try
    {
        const token = req.header("Authorization");
        const user = jwt.verify(token, process.env.SECRET_KEY);
        Users.findByPk(user.userId).then((user)=>{
            req.user = user;
            next();
        })
    }
    catch(err)
    {
        console.log(err);
        return res.status(401).json({ success: false });
    }
}