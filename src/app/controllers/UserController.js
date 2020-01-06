import { where, fn, col } from 'sequelize';

import { UserMessages } from '../res/messages';

import returnToken from '../utils/token';

import User from '../models/User';

class UserController {
  async show(req, res) {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'nickname', 'email'],
    });

    if (!user) {
      return res.status(404).json({ error: UserMessages.USER_NOT_FOUND });
    }

    return res.json(user);
  }

  async store(req, res) {
    const name = req.body.name.trim();
    const nickname = req.body.nickname.trim();
    const email = req.body.email.trim();

    const emailInUse =
      (await User.count({
        where: where(fn('LOWER', col('email')), fn('LOWER', email)),
      })) === 1;

    if (emailInUse) {
      return res.status(409).json({
        error: UserMessages.EMAIL_ALREADY_IN_USE,
      });
    }

    const nickInUse =
      (await User.count({
        where: where(fn('LOWER', col('nickname')), fn('LOWER', nickname)),
      })) === 1;

    if (nickInUse) {
      return res.status(409).json({
        error: UserMessages.NICKNAME_ALREADY_IN_USE,
      });
    }

    const { id, admin } = await User.create({
      name,
      nickname,
      email,
      password: req.body.password,
    });

    return res.status(201).json({
      access_token: returnToken(id, admin),
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: UserMessages.USER_NOT_FOUND });
    }

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: where(fn('LOWER', col('email')), fn('LOWER', email)),
      });

      if (userExists)
        return res
          .status(409)
          .json({ error: UserMessages.EMAIL_ALREADY_IN_USE });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: UserMessages.OLD_PASSWORD_WRONG });
    }

    await user.update(req.body);

    return res.status(204).json();
  }
}

export default new UserController();
