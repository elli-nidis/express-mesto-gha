const express = require('express');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64b3dce9019b9e414ccfb356',
  };
  next();
});

app.get('/', (_req, res) => {
  res.json({ response: 'success' });
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
  console.log(`Приложение работает на ${PORT} порте`);
});
