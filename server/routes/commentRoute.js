const { Router } = require('express');
const {
  createComment,
  deleteComment,
} = require('../controllers/commentController');
const protect = require('../middleware/routeProtector');
const likeOrRemovelike = require('../middleware/likePost');
const editContent = require('../middleware/editContent');
const router = Router();

router.post('/:postId', protect, createComment);
router.delete('/:postId/:commentId', protect, deleteComment);
router.patch('/likecomment/:id', protect, likeOrRemovelike);
router.patch('/editcomment/:contentId', protect, editContent);

module.exports = router;
