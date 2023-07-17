const Card = require('../models/card');
const { badRequest, notFound, serverError } = require('../utils/constants');

function getCards(_req, res) {
  return Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(serverError).send({ message: 'Произошла ошибка' }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
        return;
      }
      res.status(serverError).send({ message: 'Произошла ошибка' });
    });
}

function deleteCard(req, res) {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(notFound).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Некорректный id карточки',
        });
        return;
      }
      res.status(serverError).send({ message: 'Произошла ошибка' });
    });
}

function likeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(notFound).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Некорректный id карточки',
        });
        return;
      }
      res.status(serverError).send({ message: 'Произошла ошибка' });
    });
}

function dislikeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(notFound).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Некорректный id карточки',
        });
        return;
      }
      res.status(serverError).send({ message: 'Произошла ошибка' });
    });
}

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
