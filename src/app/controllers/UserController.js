import Sequelize from 'sequelize';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const emailInUse =
      (await User.count({
        where: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('email')),
          Sequelize.fn('lower', req.body.email)
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
          Sequelize.fn('lower', Sequelize.col('nickname')),
          Sequelize.fn('lower', req.body.nickname)
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
}

export default new UserController();
