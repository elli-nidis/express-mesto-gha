const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  badRequest, unauthorized, notFound, serverError,
} = require('../utils/constants');
// const { auth } = require('../middlewares/auth');

function getUsers(_req, res) {
  return User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(serverError).send({ message: 'Произошла ошибка' }));
}

function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Некорректный id пользователя',
        });
        return;
      }
      res.status(serverError).send({ message: 'Произошла ошибка' });
    });
}

function createUser(req, res) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id, name: user.name, about: user.about, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
        return;
      }
      res.status(serverError).send({ message: 'Произошла ошибка' });
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: 'Пользователя с таким id нет' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
        return;
      }
      res.status(serverError).send({ message: 'Произошла ошибка' });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: 'Пользователя с таким id нет' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
        return;
      }
      res.status(serverError).send({ message: 'Произошла ошибка' });
    });
}

function login(req, res) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-word-mutabor', { expiresIn: '7d' });
      // res.send({ token });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      })
        .send({ _id: user._id, email: user.email });
    })
    .catch((err) => {
      res.status(unauthorized).send({ message: err.message }); // Исправить- объект ошибки
    });
}

function getMe(req, res) {
  console.log('getMe');
  const { _id } = req.user;
  console.log(req.user);

  User.findOne({ _id })
    .then((user) => {
      res.send({
        _id: user._id, name: user.name, about: user.about, email: user.email,
      });
    });

  // res.send(_id);
}

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getMe,
};
