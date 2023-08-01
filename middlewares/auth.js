const jwt = require('jsonwebtoken');
const { unauthorized } = require('../utils/constants');

function auth(req, res, next) {
  console.log('мидлвэра cookies');
  console.log(req.headers.cookie);

  const token = req.headers.cookie.replace('jwt=', '');

  // const { authorization } = req.headers;

  // if (!authorization || !authorization.startWith('Bearer ')) {
  if (!token) {
    return res.status(unauthorized).send({ message: 'Необходима авторизация' });
  }

  // const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'secret-word-mutabor');
  } catch (err) {
    return res.status(unauthorized).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  console.log('мидлвэра');
  console.log(payload);

  next();
}

module.exports = { auth };
