// routes/postsRouter.js
const Router = require('express');
const router = Router();
const passport = require('passport');
const userController = require('../controllers/userController');

router.get('/', (req, res) => res.render('index'));
router.get('/sign-up', (req, res) => res.render('sign-up-form'));
router.post('/sign-up', ...userController.createUser);
router.get('/log-in', (req, res) => {
  res.render('login', { message: req.query.message });
});
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
