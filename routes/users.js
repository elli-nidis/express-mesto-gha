const router = require('express').Router();
const { auth } = require('../middlewares/auth');

const {
  getUsers, getUser, updateUser, updateAvatar, getMe,
} = require('../controllers/users');

// router.post('/', createUser);
router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', getUser);
// router.get('/me', getMe);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
