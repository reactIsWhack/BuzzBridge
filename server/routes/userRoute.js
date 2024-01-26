const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getLoginStatus,
  friendRequest,
  acceptFriendRequest,
} = require('../controllers/userController');
const protect = require('../middleware/routeProtector');
const router = express.Router();

router.post('/registeruser', registerUser);
router.post('/loginuser', loginUser);
router.get('/logoutuser', logoutUser);
router.get('/getloginstatus', getLoginStatus);
router.patch('/friendrequest/:friendId', protect, friendRequest);
router.patch('/acceptfriendrequest/:userId', protect, acceptFriendRequest);

module.exports = router;
