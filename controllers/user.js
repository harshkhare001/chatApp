const path = require('path');

exports.getSignUpPage = (req,res,next)=>
{
    res.sendFile(path.join(__dirname, "../", "public", "views", "signup.html"))
}