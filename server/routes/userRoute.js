const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getLoginStatus,
  friendRequest,
  acceptFriendRequest,
  getLoggedInUser,
  getAllUsers,
  getUserProfile,
  updateUser,
} = require('../controllers/userController');
const protect = require('../middleware/routeProtector');
const uploader = require('../utils/fileUpload');
const router = express.Router();

router.post('/registeruser', registerUser);
router.post('/loginuser', loginUser);
router.get('/logoutuser', logoutUser);
router.get('/getloginstatus', getLoginStatus);
router.patch('/friendrequest/:friendId', protect, friendRequest);
router.patch('/acceptfriendrequest/:userId', protect, acceptFriendRequest);
router.get('/user', protect, getLoggedInUser);
router.get('/allusers', protect, getAllUsers);
router.get('/userprofile/:userId', protect, getUserProfile);
router.patch('/update', protect, uploader.single('avatar'), updateUser);

module.exports = router;
