import Sequelize from 'sequelize';
import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async show(req, res) {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'nickname', 'email'],
    });

    res.json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(6),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors.' });
    }

    const emailInUse =
      (await User.count({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('email')),
          Sequelize.fn('LOWER', req.body.email)
        ),
      })) === 1;

    if (emailInUse) {
      return res.status(409).json({
        error: 'This email is already in use.',
      });
    }

    const nickInUse =
      (await User.count({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('nickname')),
          Sequelize.fn('LOWER', req.body.nickname)
        ),
      })) === 1;

    if (nickInUse) {
      return res.status(409).json({
        error: 'This nickname is already in use.',
      });
    }

    await User.create(req.body);

    return res.status(201).json();
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().min(6),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirmation: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors.' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('email')),
          Sequelize.fn('LOWER', email)
        ),
      });

      if (userExists)
        return res.status(409).json({ error: 'This email is already in use.' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match.' });
    }

    await user.update(req.body);

    return res.status(204).json();
  }
}

export default new UserController();
