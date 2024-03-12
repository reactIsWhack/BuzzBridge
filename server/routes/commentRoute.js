const { Router } = require('express');
const {
  createComment,
  deleteComment,
  getComments,
} = require('../controllers/commentController');
const protect = require('../middleware/routeProtector');
const likeOrRemovelike = require('../middleware/likeContent');
const editContent = require('../middleware/editContent');
const router = Router();

router.post('/:postId', protect, createComment);
router.delete('/:postId/:commentId', protect, deleteComment);
router.patch('/likecomment/:id', protect, likeOrRemovelike);
router.patch('/editcomment/:contentId', protect, editContent);
router.get('/:postId', protect, getComments);

module.exports = router;
