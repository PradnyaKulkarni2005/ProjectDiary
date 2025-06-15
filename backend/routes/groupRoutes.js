const express = require('express');
const router = express.Router();
const { createGroup,respondToInvite,checkUserGroupStatus,getInvitations,getGroupMemberStatuses } = require('../controllers/groupController');
router.post('/create', createGroup);
router.post('/respond', respondToInvite);
router.get('/user/:userId', checkUserGroupStatus);
router.get('/invitations/:userId', getInvitations);
router.get('/leader/members/:leaderId', getGroupMemberStatuses);

module.exports = router;