const { Router } = require('express');
const {
  createPost,
  getUserPosts,
  getAllPosts,
  deletePost,
  likeOrRemovelike,
} = require('../controllers/postController');
const protect = require('../middleware/routeProtector');
const uploader = require('../utils/fileUpload');

const router = Router();

router.post('/', protect, uploader.single('photo'), createPost);
router.get('/userposts', protect, getUserPosts);
router.get('/allposts', protect, getAllPosts);
router.delete('/:id', protect, deletePost);
router.patch('/:id', protect, likeOrRemovelike);

module.exports = router;
