const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/registeruser', registerUser);
router.post('/loginuser', loginUser);

module.exports = router;
