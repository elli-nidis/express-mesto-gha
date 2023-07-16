// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар
const router = require('express').Router();

const { createUser, getUsers, getUser } = require('../controllers/users');

router.post('/', createUser); // было "/users" но я убрала, т.к. в app уже стоит /users. Проверить на работоспособность

router.get('/', getUsers);

router.get('/:userId', getUser);

module.exports = router;
