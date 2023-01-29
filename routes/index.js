const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2).email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use('*', auth, () => {
  throw new NotFound('Путь не найден');
});

module.exports = router;
