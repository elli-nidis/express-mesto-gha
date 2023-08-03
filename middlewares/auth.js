const jwt = require('jsonwebtoken');
// const { unauthorized } = require('../utils/constants');
const UnauthorizedError = require('../errors/unauthorizedError');

const unauthorizedError = new UnauthorizedError({ message: 'Необходима авторизация' });

// eslint-disable-next-line consistent-return
function auth(req, _res, next) {
  console.log('auth');

  // const token = req.headers.cookie.replace('jwt=', '') || undefined;
  let token;
  try {
    token = req.headers.cookie.replace('jwt=', '');
  } catch (err) {
    return next(unauthorizedError);
  }

  console.log('token');
  console.log(token);

  if (!token) {
    // return res.status(unauthorized).send({ message: 'Необходима авторизация' });
    return next(unauthorizedError);
    // return;
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-word-mutabor');
  } catch (err) {
    // return res.status(unauthorized).send({ message: 'Необходима авторизация' });
    return next(unauthorizedError);
    // return;
  }

  req.user = payload;

  next();
}

module.exports = { auth };
