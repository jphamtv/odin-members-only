// controllers/userController.js
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const validateUser = [
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
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/).withMessage('Password must contain at least one special character'),
  body('confirm_password').custom((value, { req }) => {
    if (value === req.body.password) {
      return true;
    } else {
      throw new Error(`Passwords do not match`)
    }
  })
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
        return res.render('sign-up', {
          errors: errors.array(),
          user: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            is_admin: req.body.is_admin === 'true'
          }
        });
      }
  
      const { first_name, last_name, username } = req.body;
      const password = await bcrypt.hash(req.body.password, 10);
      const is_admin = req.body.is_admin === 'true'; // Convert checkbox value to boolean
      const is_member = is_admin ? true : false;

      await User.createNew({
        first_name,
        last_name,
        username,
        password,
        is_admin,
        is_member
      });

      // Redirect to login with success message
      res.redirect('/log-in?message=Registration successful! Please log in.');
    } catch (error) {
      console.error('Error creating user:', error);
      res.render('sign-up', {
        errors: [{ msg: 'Error creating account. Please try again. ' }],
        user: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          is_admin: req.body.is_admin === 'true'
        }
      });
    }
  }
];

async function updateUserMemberStatus(req, res) {
  try {
    const id = req.user.id;
    const { is_member } = req.body;
    const updatedItem = await User.updateMemberStatusById(id, { is_member });
    if (updatedItem) {
      res.json({ message: `User's member status updated successfully`, user: updatedItem });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(`Error updating user's member status: `, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

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
  createUser,
  updateUserMemberStatus,
  deleteUser
};
