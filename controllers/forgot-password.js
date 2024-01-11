const path = require('path');
const Sib = require('sib-api-v3-sdk');
const User = require('../models/user');
const FPR = require('../models/forgot-password');
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = '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'


exports.getHomePage = (req, res, next)=>
{
    res.sendFile(path.join(__dirname, "../", "public", "views", "forgotpassword.html"))
}

exports.sendEmail = async (req, res, next)=>
{
    const uu_id = uuidv4();
    try
    {
        const user = await User.findByPk(req.body.email);
        console.log(user);
        if(!user)
        {
            res.status(404).json({ message: "User doesn't exist, Please sign up!"});
        }
        else
        {
            await FPR.create({
                id : uu_id,
                isactive : true,
                userId : user.id
            })
        }

        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender =
        {
            email : 'harshd.18.besi@acharya.ac.in',
            name : 'Chat App'
        }
        const receivers = [{
            email : req.body.email
        }]
        tranEmailApi.sendTransacEmail({
            sender,
            to : receivers,
            subject : 'forgot Password',
            textContent : `Hi ${user.name},
            Please reset your Password using this password reset link http://localhost:3000/resetpassword/${uu_id}
            Thank You`
           })
           .then((result)=>{
                console.log(result);
                res.status(200).json({message :"Email Sent Successfully", success:true});
           })
           .catch(console.log)
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.getResetPasswordPage = async (req, res, next)=>
{
    const uu_id = req.params.uu_id;
    try
    {
        const uuid = await FPR.findByPk(uu_id, { attributes: ["isactive"]});
        if(uuid && uuid.isactive)
        {
            res.sendFile(path.join(__dirname, "../", "public", "views", "resetpassword.html"))
        }
        else
        {
            res.status(404).json('File not found');
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.changePassword = async (req, res, next)=>
{
    const {uu_id, password} = req.body;
    try
    {
        const uuid = await FPR.findByPk(uu_id);

        if(!uuid.isactive)
        {
            res.status(404).send("<h1>page not found</h1>");
        }
        else
        {
            const user = await User.findByPk(uuid.userId);
            bcrypt.hash(password, 10, async(err, hash)=>{
                await user.update({
                    password : hash
                })

                await uuid.update({
                    isactive : false
                })
            })
            res.status(201).json({ message: "password changed successfully, go to login" });
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ message: "server error" });
    }
}