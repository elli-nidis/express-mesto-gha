// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя

// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар
const router = require('express').Router();

const { createUser, getUsers } = require('../controllers/users');

router.post('/', createUser); // было "/users" но я убрала, т.к. в app уже стоит /users. Проверить на работоспособность

router.get('/', getUsers);

module.exports = router;
