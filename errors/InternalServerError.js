const { serverError } = require('../utils/constants');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = serverError;
  }
}

module.exports = InternalServerError;
