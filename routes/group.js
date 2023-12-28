const express = require('express');
const groupController = require('../controllers/group');
const userAuthernticator = require('../middleware/auth');

const router = express.Router();

router.post('/addGroup', userAuthernticator.authenticate, groupController.addGroup);

router.get('/getGroups', userAuthernticator.authenticate, groupController.getGroups);

router.get('/getGroupMembers', groupController.getGroupMembers);

router.get('/getGroupDetails', groupController.getGroupDetails);

router.get('/removeUser', groupController.removeUser);

router.get('/getGroupMembersToAdd', groupController.getGroupMembersToAdd);

router.get('/addUserToGroup', groupController.addUser);

module.exports = router;