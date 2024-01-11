const path = require('path');
const User = require('../models/user');
const Message = require('../models/message');
const awsServices = require('../services/s3services');
const { JSON } = require('sequelize');

exports.getDashboardPage = (req, res, next)=>
{
    res.sendFile(path.join(__dirname, "../", "public", "views", "index.html"));
}

exports.getMessages = async(req, res, next)=>
{
    const user = await User.findByPk(req.body.user);
    //console.log(user.name);
    try
    {
        await Message.create({
            text : req.body.message,
            sentBy : user.name,
            userId : user.id,
            groupId : req.body.groupId
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
        const groupId = req.params['groupId'];
        console.log(groupId);
        if(isNaN(groupId))
        {
            return res.status(200).json({message:'select a group'});
        }
        const messages = await Message.findAll({where : {groupId : groupId}});
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

exports.saveImages = async (req, res, next)=>
{
    const image = req.file;
    const groupId = req.body.groupId; 
    const userId = req.body.user;
    const fileName = `chat-images/group${groupId}/userId/${Date.now()}_${image.originalname}`;
    const imageUrl = await awsServices.uploadToS3(image.buffer, fileName);
    //console.log(imageUrl);

    const user = await User.findByPk(userId);

    try
    {
        await Message.create({
            text : imageUrl,
            sentBy : user.name,
            userId : user.id,
            groupId : groupId,
            isImage : true
        })
        res.status(201).json({message: "message sent successfully"});
    }
    catch(err)
    {
        console.log(err);
    }
}