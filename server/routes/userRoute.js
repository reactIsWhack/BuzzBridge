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
  removeFriend,
} = require('../controllers/userController');
const protect = require('../middleware/routeProtector');
const uploader = require('../utils/fileUpload');
const router = express.Router();

router.post('/registeruser', registerUser); // tested
router.post('/loginuser', loginUser);
router.get('/logoutuser', logoutUser);
router.get('/getloginstatus', getLoginStatus);
router.patch('/friendrequest/:friendId', protect, friendRequest); // tested
router.patch('/acceptfriendrequest/:userId', protect, acceptFriendRequest); // tested
router.get('/user', protect, getLoggedInUser); // tested
router.get('/allusers/:limit', protect, getAllUsers); // tested
router.get('/userprofile/:userId', protect, getUserProfile); // tested
router.patch('/update', protect, uploader.single('avatar'), updateUser); // tested
router.patch('/removefriend/:friendId', protect, removeFriend);

module.exports = router;
