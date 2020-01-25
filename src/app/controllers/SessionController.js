import { where, fn, col } from 'sequelize';

import { UserMessages } from '../res/messages';

import returnToken from '../utils/token';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: where(fn('LOWER', col('email')), fn('LOWER', email)),
      attributes: [
        'id',
        'name',
        'nickname',
        'first_skill_configuration',
        'bio',
        'admin',
        'email',
        'password_hash',
      ],
    });

    if (!user) {
      return res.status(404).json({ error: UserMessages.USER_NOT_FOUND });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(422).json({ error: UserMessages.PASSWORD_WRONG });
    }

    const userToReturn = {
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      first_skill_configuration: user.first_skill_configuration,
      email: user.email,
      bio: user.bio,
    };

    return res.status(201).json({
      access_token: returnToken(user.id, user.admin),
      user: userToReturn,
    });
  }
}

export default new SessionController();
