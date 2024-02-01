const { Router } = require('express');
const { createComment } = require('../controllers/commentController');
const protect = require('../middleware/routeProtector');
const router = Router();

router.post('/:postId', protect, createComment);

module.exports = router;
