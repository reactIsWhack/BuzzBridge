const { Router } = require('express');
const {
  createPost,
  getUserPosts,
  getAllPosts,
} = require('../controllers/postController');
const protect = require('../middleware/routeProtector');
const uploader = require('../utils/fileUpload');

const router = Router();

router.post('/', protect, uploader.single('photo'), createPost);
router.get('/userposts', protect, getUserPosts);
router.get('/allposts', protect, getAllPosts);

module.exports = router;
