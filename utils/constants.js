// http status codes errors
const badRequest = 400;
const unauthorized = 401;
const forbidden = 403;
const notFound = 404;
const conflict = 409;
const serverError = 500;

const regexpEmail = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{1,4}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  badRequest, unauthorized, forbidden, notFound, conflict, serverError, regexpEmail,
};
