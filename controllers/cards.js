const Card = require('../models/card');

function getCards(_req, res) {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function deleteCard(req, res) {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Некорректный id карточки',
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
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
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Некорректный id карточки',
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function dislikeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { naw: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Некорректный id карточки',
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
