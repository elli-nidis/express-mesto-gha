const jwt = require('jsonwebtoken');
const { unauthorized } = require('../utils/constants');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWith('Bearer ')) {
    return res.status(unauthorized).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(unauthorized).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
}

module.exports = { auth };
