// controllers/userController.js
const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

const validateCategory = [
  body('first_name').trim()
    .isLength({ max: 200 }).withMessage(`Name must not exceed 200 characters`)
    .matches(/^[a-z0-9 '-]+$/i).withMessage('Name contains invalid characters'),
  body('last_name').trim()
    .isLength({ max: 200 }).withMessage(`Name must not exceed 200 characters`)
    .matches(/^[a-z0-9 '-]+$/i).withMessage('Name contains invalid characters'),
  body('username').trim()
    .isEmail().withMessage(`Invalid email`),
  body('password').trim()
    .isLength({ min: 8 }).withMessage(`Password must be longer than 8 characters`)
    .matches(/^[a-z0-9 .,!?'-/@#$%^&*]+$/i).withMessage('Password contains invalid characters')
];

async function getAllPosts(req, res) {
  try {
    const posts = await Post.getAll();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const createPost = [
  validateUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const author_id = req.params.id;
      const { title, message } = req.body;
      const newPost = await Post.createNew({ title, message, author_id });
      res.status(201).json({ message: 'Post created successfully', user: newPost });
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
