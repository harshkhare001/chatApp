const express = require('express');
const groupController = require('../controllers/group');
const userAuthernticator = require('../middleware/auth');

const router = express.Router();

router.post('/group', userAuthernticator.authenticate, groupController.addGroup);

router.get('/group', userAuthernticator.authenticate, groupController.getGroups);

router.get('/group/:groupId/members', groupController.getGroupMembers);

router.get('/group/:groupId/details', groupController.getGroupDetails);

router.get('/group/:groupId/removeUser', groupController.removeUser);

router.get('/group/:groupId/usersToAdd', groupController.getGroupMembersToAdd);

router.get('/group/:groupId/addUser', groupController.addUser);

module.exports = router;