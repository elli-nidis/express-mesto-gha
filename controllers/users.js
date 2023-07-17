const User = require('../models/user');

function getUsers(_req, res) {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Некорректный id пользователя',
        });
        return;
      }
      // console.log(err.name);
      // console.log(err.error);
      // console.log(err.message);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователя с таким id нет' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователя с таким id нет' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar,
};
