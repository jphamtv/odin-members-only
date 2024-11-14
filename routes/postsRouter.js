// routes/postsRouter.js
const Router = require('express');
const router = Router();
const postController = require('../controllers/postController');

// Middleware
function handleMessageAccess(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/log-in');
  }
  res.locals.showAuthorInfo = req.user.is_member;
  next();
}

function ensureAdmin(req, res, next) {
  if (req.user && req.user.is_admin) {
    return next();
  }
  res.status(403).json({ message: 'Unauthorized' });
}

// Public routes
router.get('/', handleMessageAccess, postController.getAllPosts);
router.get('/new', handleMessageAccess, (req, res) => res.render('new-message'));
router.post('/new', handleMessageAccess, ...postController.createPost);
router.delete('/delete/:id', ensureAdmin, postController.deletePost);

module.exports = router;
