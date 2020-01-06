import { where, fn, col } from 'sequelize';

import { UserMessages } from '../res/messages';

import returnToken from '../utils/token';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: where(fn('LOWER', col('email')), fn('LOWER', email)),
      attributes: ['id', 'name', 'admin', 'password_hash'],
    });

    if (!user) {
      return res.status(404).json({ error: UserMessages.USER_NOT_FOUND });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(422).json({ error: UserMessages.PASSWORD_WRONG });
    }

    return res.status(201).json({
      access_token: returnToken(user.id, user.admin),
    });
  }
}

export default new SessionController();
