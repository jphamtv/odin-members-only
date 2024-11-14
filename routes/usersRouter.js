// routes/postsRouter.js
const Router = require('express');
const router = Router();
const passport = require('passport');
const userController = require('../controllers/userController');

router.get('/', (req, res) => {
router.render('index', { user: req.user });
});
router.get('/sign-up', (req, res) => res.render('sign-up-form'));
router.post('/sign-up', ...userController.createUser);
router.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);
router.get('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
