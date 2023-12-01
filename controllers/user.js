const path = require('path');
const Users = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        console.log(req.body);
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