const { Router } = require('express');
const {
  createPost,
  getUserPosts,
  getAllPosts,
  deletePost,
} = require('../controllers/postController');
const protect = require('../middleware/routeProtector');
const uploader = require('../utils/fileUpload');
const likeOrRemovelike = require('../middleware/likeContent');
const editContent = require('../middleware/editContent');

const router = Router();

router.post('/', protect, uploader.single('photo'), createPost);
router.get('/userposts', protect, getUserPosts);
router.get('/allposts/:skip/:userSkip', protect, getAllPosts);
router.delete('/:id', protect, deletePost);
router.patch('/likepost/:id', protect, likeOrRemovelike);
router.patch(
  '/editpost/:contentId',
  protect,
  uploader.single('photo'),
  editContent
);

module.exports = router;
