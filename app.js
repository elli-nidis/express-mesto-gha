const express = require('express');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

const app = express();

app.get('/', (_req, res) => {
  res.json({ response: 'success' });
});

app.use('/users', require('./routes/users'));

// mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
  console.log(`Приложение работает на ${PORT} порту`);
});
