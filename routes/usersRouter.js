// routes/postsRouter.js
const Router = require('express');
const router = Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// Middleware
function redirectIfAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/log-in');
}

// Public routes
router.get('/', (req, res) => res.render('index'));
router.get('/sign-up', redirectIfAuthenticated, (req, res) => res.render('sign-up'));
router.post('/sign-up', redirectIfAuthenticated, ...userController.createUser);
router.get('/log-in', redirectIfAuthenticated, (req, res) => {
  res.render('login', { message: req.query.message });
});
router.post('/log-in', redirectIfAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in'
  })
);

// Protected route
router.get('/log-out', ensureAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
