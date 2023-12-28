const path = require('path');
const Users = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(id)
{
    return jwt.sign({userId : id}, process.env.SECRET_KEY);
}

exports.getSignUpPage = (req, res, next)=>
{
    res.sendFile(path.join(__dirname, "../", "public", "views", "signup.html"))
}

exports.getLoginPage = (req, res, next)=>
{
    res.sendFile(path.join(__dirname, "../", "public", "views", "login.html" ))
}

exports.addUser = async(req, res, next)=>
{
    try
    {
        const {name, phone, email, password} = req.body;
        //console.log(req.body);
        const user = await Users.findByPk(email);
        if(user)
        {
            return res.status(202).json({message : "User already exist"});
        }
        else
        {
            bcrypt.hash(password, 10, async(err, hash)=>
            {
                console.log(err);
                await Users.create({id:email, phone, name, password : hash });
                res.status(201).json({message: "User added successfully"});
            })
        }
    }
    catch(err)
    {
        res.status(500).json(err);
    }
}

exports.login = async (req, res, next)=>
{
    //console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    try
    {
        const user = await Users.findByPk(email);
        if(user)
        {
            bcrypt.compare(password, user.password, (err, result)=>
            {
                if(err)
                {
                    throw new Error('Somthing went Wrong');
                }
                if(result === true)
                {
                    res.status(200).json({success : true, message:"Login Successful!", token : generateAccessToken(user.id)});
                }
                else
                {
                    res.status(401).json({success : false, message:"Incorrect Password"});
                }
            })
        }
        else
        {
            res.status(404).json({success:false, message: "User Not Found"});
        }
    }
    catch(err)
    {
        console.log(err);
    }
}


exports.getAllUsers = async(req, res, next)=>
{
    try
    {
        const users = await Users.findAll();
        //console.log(users);
        res.status(201).json(users);
    }
    catch(err)
    {
        console.log(err);
    }
}