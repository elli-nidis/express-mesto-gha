const jwt = require('jsonwebtoken');
// const { unauthorized } = require('../utils/constants');
const UnauthorizedError = require('../errors/unauthorizedError');

const unauthorizedError = new UnauthorizedError({ message: 'Необходима авторизация' });

// eslint-disable-next-line consistent-return
function auth(req, _res, next) {
  const token = req.headers.cookie.replace('jwt=', '');

  if (!token) {
    // return res.status(unauthorized).send({ message: 'Необходима авторизация' });
    next(unauthorizedError);
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-word-mutabor');
  } catch (err) {
    // return res.status(unauthorized).send({ message: 'Необходима авторизация' });
    next(unauthorizedError);
    // return;
  }

  req.user = payload;

  next();
}

module.exports = { auth };
