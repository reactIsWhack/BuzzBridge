const { Router } = require('express');
const {
  createComment,
  deleteComment,
} = require('../controllers/commentController');
const protect = require('../middleware/routeProtector');
const likeOrRemovelike = require('../middleware/likePost');
const router = Router();

router.post('/:postId', protect, createComment);
router.delete('/:postId/:commentId', protect, deleteComment);
router.patch('/:id', protect, likeOrRemovelike);

module.exports = router;
