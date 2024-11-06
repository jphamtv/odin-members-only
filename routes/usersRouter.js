// routes/postsRouter.js
const Router = require('express');
const router = Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUser);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
