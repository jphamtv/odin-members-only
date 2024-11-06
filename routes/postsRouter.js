// routes/postsRouter.js
const Router = require('express');
const router = Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.delete('/:id', postController.deletePost);

module.exports = router;
