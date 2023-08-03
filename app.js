const express = require('express');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { auth } = require('./middlewares/auth');

const { login, createUser } = require('./controllers/users');

const {
  badRequest, unauthorized, forbidden, notFound, conflict, serverError,
} = require('./utils/constants');

const app = express();

app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', (_req, res) => res.status(404).json({ message: 'Такой страницы не существует' }));

app.use((err, _req, res, next) => {
  if (err.code === 11000) res.status(conflict).send({ message: 'Пользователь с указанным email уже зарегистрирован' });
  if (err.name === 'CastError' || err.name === 'ValidationError') res.status(badRequest).send({ message: 'Переданы некорректные данные' });
  if (err.statusCode === unauthorized) res.status(unauthorized).send({ message: 'Ошибка авторизации: неверный логин или пароль' });
  if (err.statusCode === forbidden) res.status(forbidden).send({ message: 'Вы не можете удалить чужую карточку' });
  if (err.statusCode === notFound) res.status(notFound).send({ message: 'Такой страницы не существует' });

  res.status(serverError).send({ message: 'Произошла ошибка' });

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  autoIndex: true,
})
  .then(() => {
    console.log('Успешное соединение с mongoDB');
  });

app.listen(PORT, () => {
  console.log(`Приложение работает на ${PORT} порте`);
});
