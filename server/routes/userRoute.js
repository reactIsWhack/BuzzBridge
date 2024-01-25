const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getLoginStatus,
  friendRequest,
} = require('../controllers/userController');
const protect = require('../middleware/routeProtector');
const router = express.Router();

router.post('/registeruser', registerUser);
router.post('/loginuser', loginUser);
router.get('/logoutuser', logoutUser);
router.get('/getloginstatus', getLoginStatus);
router.post('/friendrequest', protect, friendRequest);

module.exports = router;
