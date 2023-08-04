const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const { regexpEmail } = require('../utils/constants');
const BadRequestError = require('../errors/badRequestError');

const badRequestError = new BadRequestError('Неправильные почта или пароль');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return regexpEmail.test(v);
      },
      message: 'Указан некорректный url',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: 'Неправильно указана электронная почта',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(badRequestError);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(badRequestError);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
