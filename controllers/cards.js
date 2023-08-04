const Card = require('../models/card');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const InternalServerError = require('../errors/InternalServerError');
const BadRequestError = require('../errors/badRequestError');

const forbiddenError = new ForbiddenError('Вы не можете удалить чужую карточку');
const notFoundError = new NotFoundError('Запрашиваемые данные не найдены');
const internalServerError = new InternalServerError('Произошла ошибка');
const badRequestError = new BadRequestError('Переданы некорректные данные');

function getCards(_req, res, next) {
  return Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => next(internalServerError));
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(badRequestError);
        return;
      }
      next(internalServerError);
    });
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const currentUser = req.user._id;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(notFoundError);
        return;
      }
      const cardOwner = card.owner.toString();
      if (cardOwner !== currentUser) {
        next(forbiddenError);
        return;
      }
      // eslint-disable-next-line consistent-return
      return Card.deleteOne({ _id: cardId })
      // return Card.findByIdAndRemove(cardId)
        .then((cardData) => res.send(cardData));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(badRequestError);
        return;
      }
      next(internalServerError);
    });
}

function likeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(notFoundError);
        return;
      }
      // eslint-disable-next-line consistent-return
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(badRequestError);
        return;
      }
      next(internalServerError);
    });
}

function dislikeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(notFoundError);
        return;
      }
      // eslint-disable-next-line consistent-return
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(badRequestError);
        return;
      }
      next(internalServerError);
    });
}

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
