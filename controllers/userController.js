// controllers/userController.js
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

const validateCategory = [
  body('name').trim()
    .isLength({ min: 1, max: 200 }).withMessage(`Name must be between 1 and 200 characters`)
    .matches(/^[a-z0-9 .,!?'-/]+$/i).withMessage('Name can only contain letters, numbers, and spaces'),
  body('description').trim()
    .optional({ nullable: true })
    .if((value) => value !== null && value !== '')
    .isLength({ max: 200 }).withMessage(`Description must not exceed 200 characters`)
    .matches(/^[a-z0-9 .,!?'-/]+$/i).withMessage('Description contains invalid characters')
    .escape()
];

async function getUser(req, res) {
  try {
    const { username } = req.body;
    const user = await User.getByUsername(username);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.getById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const createUser = [
  validateUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { first_name, last_name, username, password, is_admin } = req.body;
      const newUser = await User.insertNew({ first_name, last_name, username, password, is_admin });
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];

async function deleteUser(req, res) {
  try {
    const userId = req.params.id; 
    const deleted = await User.deleteById(userId);    

    if (deleted) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getUser,
  getUserById,
  deleteUser
};
