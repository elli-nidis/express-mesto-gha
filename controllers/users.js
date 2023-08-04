const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const UnauthorizedError = require('../errors/unauthorizedError');
const NotFoundError = require('../errors/notFoundError');
const InternalServerError = require('../errors/InternalServerError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

const unauthorizedError = new UnauthorizedError('Необходима авторизация');
const notFoundError = new NotFoundError('Запрашиваемые данные не найдены');
const internalServerError = new InternalServerError('Произошла ошибка');
const badRequestError = new BadRequestError('Переданы некорректные данные');
const conflictError = new ConflictError('Пользователь с указанным email уже зарегистрирован');

function getUsers(_req, res, next) {
  return User.find({})
    .then((users) => res.send(users))
    .catch(() => next(internalServerError));
}

function getUser(req, res, next) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(notFoundError);
      }
      // eslint-disable-next-line consistent-return
      return res.status(200).send({
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(badRequestError);
      }
      return next(internalServerError);
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
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(badRequestError);
      }
      if (err.code === 11000) {
        // eslint-disable-next-line consistent-return
        return next(conflictError);
      }
      return next(internalServerError);
    });
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(notFoundError);
      }
      // eslint-disable-next-line consistent-return
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(badRequestError);
      }
      return next(internalServerError);
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(notFoundError);
      }
      // eslint-disable-next-line consistent-return
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(badRequestError);
      }
      return next(internalServerError);
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
    });
}

function getMe(req, res, next) {
  const { _id } = req.user;

  User.findOne({ _id })
    .then((user) => {
      res.send({
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      });
    })
    .catch(() => next(internalServerError));
}

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getMe,
};
