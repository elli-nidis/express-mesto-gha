const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const UnauthorizedError = require('../errors/unauthorizedError');
const NotFoundError = require('../errors/notFoundError');
const InternalServerError = require('../errors/InternalServerError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

const unauthorizedError = new UnauthorizedError({ message: 'Необходима авторизация' });
const notFoundError = new NotFoundError({ message: 'Запрашиваемые данные не найдены' });
const internalServerError = new InternalServerError({ message: 'Произошла ошибка' });
const badRequestError = new BadRequestError({ message: 'Переданы некорректные данные' });
const conflictError = new ConflictError({ message: 'Пользователь с указанным email уже зарегистрирован' });

function getUsers(_req, res, next) {
  return User.find({})
    .then((users) => res.send(users))
    .catch(() => next(internalServerError));
  // .catch(() => res.status(serverError).send({ message: 'Произошла ошибка' }));
}

function getUser(req, res, next) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        // return res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
        next(notFoundError);
        return;
      }
      // eslint-disable-next-line consistent-return
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(badRequest).send({
        //   message: 'Некорректный id пользователя',
        // });
        next(badRequestError);
        return;
      }
      // res.status(serverError).send({ message: 'Произошла ошибка' });
      next(internalServerError);
    });
}

function createUser(req, res, next) {
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
        // res.status(badRequest).send({
        //   message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        // });
        next(badRequestError);
        return;
      }
      if (err.code === 11000) {
        next(conflictError);
        return;
      }
      // res.status(serverError).send({ message: 'Произошла ошибка' });
      next(internalServerError);
    });
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        // return res.status(notFound).send({ message: 'Пользователя с таким id нет' });
        next(notFoundError);
        return;
      }
      // eslint-disable-next-line consistent-return
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(badRequest).send({
        //   message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        // });
        next(badRequestError);
        return;
      }
      // res.status(serverError).send({ message: 'Произошла ошибка' });
      next(internalServerError);
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        // return res.status(notFound).send({ message: 'Пользователя с таким id нет' });
        next(notFoundError);
        return;
      }
      // eslint-disable-next-line consistent-return
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(badRequest).send({
        //   message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        // });
        next(badRequestError);
        return;
      }
      // res.status(serverError).send({ message: 'Произошла ошибка' });
      next(internalServerError);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-word-mutabor', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      })
        .send({ _id: user._id, email: user.email });
    })
    .catch(() => {
      next(unauthorizedError);
      // res.status(unauthorized).send({ message: err.message });
    });
}

function getMe(req, res, next) {
  const { _id } = req.user;

  User.findOne({ _id })
    .then((user) => {
      res.send({
        _id: user._id, name: user.name, about: user.about, email: user.email,
      });
    })
    .catch(() => next(internalServerError));
}

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getMe,
};
