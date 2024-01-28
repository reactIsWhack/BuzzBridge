const { Router } = require('express');
const { createPost } = require('../controllers/postController');
const protect = require('../middleware/routeProtector');
const uploader = require('../utils/fileUpload');

const router = Router();

router.post('/', protect, uploader.single('photo'), createPost);

module.exports = router;
