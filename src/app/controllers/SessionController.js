import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('email')),
        Sequelize.fn('LOWER', email)
      ),
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ message: 'Password does not match.' });
    }

    return res.json({
      access_token: jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
