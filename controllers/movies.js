const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ ...req.body, owner })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при создании фильма'));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFound('Запрашиваемый фильм не найден'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new Forbidden('Вы не можете удалять чужие фильмы');
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then(() => {
          res.status(200).send({ message: 'Фильм удален' });
        })
        .catch(next);
    })
    .catch(next);
};