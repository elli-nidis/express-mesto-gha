const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const unauthorizedError = new UnauthorizedError({ message: 'Необходима авторизация' });

// eslint-disable-next-line consistent-return
function auth(req, _res, next) {
  // let token;
  // try {
  //   // token = req.headers.cookie.replace('jwt=', '');
  //   token = req.cookies.jwt;
  // } catch (err) {
  //   return next(unauthorizedError);
  // }
  const token = req.cookies.jwt;

  if (!token) {
    return next(unauthorizedError);
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-word-mutabor');
  } catch (err) {
    return next(unauthorizedError);
  }

  req.user = payload;

  next();
}

module.exports = { auth };
