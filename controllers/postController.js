// controllers/postController.js
const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

const validatePost = [
  body('title').trim()
    .isLength({ max: 200 }).withMessage(`Title must not exceed 200 characters`)
    .matches(/^[a-z0-9 '-]+$/i).withMessage('Name contains invalid characters'),
  body('message').trim()
    .matches(/^[a-z0-9 .,!?'-/]+$/i).withMessage('Description contains invalid characters')
];

async function getAllPosts(req, res) {
  try {
    const posts = await Post.getAll();
    console.log(posts);
    res.render('index', { messages: posts });
  } catch (error) {
    console.error('Error fetching posts', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const createPost = [
  validatePost,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.redirect('/login');
      }
  
      const { title, message } = req.body;
      const author_id = req.user.id;

      const newPost = await Post.createNew({ title, message, author_id });

      res.redirect('/');
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];

async function deletePost(req, res) {
  try {
    const postId = req.params.id; 
    const deleted = await Post.deleteById(postId);    

    if (deleted) {
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error('Error deleting post: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllPosts,
  createPost,
  deletePost
};
