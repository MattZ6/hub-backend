import Sequelize from 'sequelize';

import User from '../models/User';

class UserController {
  async store(req, res) {
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
