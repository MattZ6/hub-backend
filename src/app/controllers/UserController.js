import { where, fn, col } from 'sequelize';
import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async show(req, res) {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'nickname', 'email'],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    return res.json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .trim()
        .min(6),
      nickname: Yup.string()
        .required()
        .trim()
        .min(3),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .trim()
        .min(6),
      passwordConfirmation: Yup.string()
        .required()
        .oneOf([Yup.ref('password')]),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors.' });
    }

    const name = req.body.name.trim();
    const nickname = req.body.nickname.trim();
    const email = req.body.email.trim();

    const emailInUse =
      (await User.count({
        where: where(fn('LOWER', col('email')), fn('LOWER', email)),
      })) === 1;

    if (emailInUse) {
      return res.status(409).json({
        error: 'This email is already in use.',
      });
    }

    const nickInUse =
      (await User.count({
        where: where(fn('LOWER', col('nickname')), fn('LOWER', nickname)),
      })) === 1;

    if (nickInUse) {
      return res.status(409).json({
        error: 'This nickname is already in use.',
      });
    }

    await User.create({
      name,
      nickname,
      email,
      password: req.body.password,
    });

    return res.status(201).json();
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .trim()
        .min(6),
      email: Yup.string()
        .trim()
        .email(),
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

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: where(fn('LOWER', col('email')), fn('LOWER', email)),
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
