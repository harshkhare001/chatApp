const Group = require('../models/user');
const User = require('../models/groups');

exports.addGroup = async(req, res, next)=>
{
    const user = req.user;
    console.log(user.id, req.body);
    const name = req.body.name;
    const memberIds = req.body.memberIds;
    try
    {
        const group = await user.createGroup({
            name : name,
            AdminId : user.id
        });
        memberIds.push(user.id);
        await group.addUsers(memberIds.map((ele)=>{
            return ele;
        }))
        return res.status(201).json({group, message : 'group created Successfully'});
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.getGroups = async(req, res, next)=>
{
    try
    {
        const user = req.user;
        const groups = await user.getGroups();
        if(groups.length >=1)
        {
            res.status(201).json({groups, message : 'groups found'});
        }
        else
        {
            res.status(400).json({message : 'No groups found'});
        }
        
    }
    catch(err)
    {
        console.log(err);
    }
}