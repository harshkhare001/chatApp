const Group = require('../models/groups');
const User = require('../models/user');

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

exports.getGroupMembers = async (req, res, next)=>
{
    try
    {
        const groupId = +req.query.groupId;
        const group = await Group.findByPk(groupId);
        const users = await group.getUsers();
        res.status(201).json(users);
    }
    catch(err)
    {
        console.log(err);
    }

}

exports.getGroupDetails = async(req, res, next)=>
{
    try
    {
        const groupId = +req.query.groupId;
        const group = await Group.findByPk(groupId);
        res.status(201).json(group);
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.removeUser = async(req, res, next)=>
{
    try
    {
        const userId = req.query.userId;
        const groupId = +req.query.groupId;
        console.log(userId, groupId);
        const group = await Group.findByPk(groupId);
        const response = await group.removeUser(userId);
        res.status(201).json({message:'User removed Successfully', response}); 
    }
    catch(err)
    {
        console.log(err);
    }
}

//let difference = arr1.filter(x=>!arr2.includes(x));

exports.getGroupMembersToAdd = async(req, res, next)=>
{
    try
    {
        const arr1 = await User.findAll();
        const groupId = +req.query.groupId;
        const group = await Group.findByPk(groupId);
        const arr2 = await group.getUsers();
        let usersToAdd = getDifference(arr1,arr2);
        res.status(201).json(usersToAdd);
    }
    catch(err)
    {
        console.log(err);
    }
}

function getDifference(arr1, arr2)
{
    return arr1.filter(object1 =>{
        return !arr2.some(object2=>{
            return object1.id === object2.id;
        })
    })
}

exports.addUser = async(req, res, next)=>
{
    try
    {
        const userId = req.query.userId;
        const groupId = +req.query.groupId;
        console.log(userId, groupId);
        const group = await Group.findByPk(groupId);
        const data = await group.addUser(userId);
        res.status(201).json({message:'user added', data});
    }
    catch(err)
    {
        console.log(err);
    }
}