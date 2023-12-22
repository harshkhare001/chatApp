const path = require('path');
const User = require('../models/user');
const Message = require('../models/message');

exports.getDashboardPage = (req, res, next)=>
{
    res.sendFile(path.join(__dirname, "../", "public", "views", "index.html"));
}

exports.getMessages = async(req, res, next)=>
{
    console.log(req.body);
    const user = await User.findByPk(req.body.user);
    console.log(user.name);
    try
    {
        await Message.create({
            text : req.body.message,
            sentBy : user.name
        })
        res.status(201).json({message: "message sent successfully"});
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.fetchMessages = async(req, res, next)=>
{   
    
    try
    {
        const lastMessageId = +req.query.lastMessageId;
        const messages = await Message.findAll();
        let mes =[];

        if(lastMessageId===0)
        {
            res.status(201).json(messages);
        }
        else
        {
            messages.forEach((message)=>{
                if(message.id > lastMessageId)
                {
                    mes.push(message);
                }
            })
            res.status(201).json(mes);
        }
    }
    catch(err)
    {
        console.log(err);
    }
}