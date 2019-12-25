import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required()
        .trim(),
      password: Yup.string()
        .required()
        .trim()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors.' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('email')),
        Sequelize.fn('LOWER', email)
      ),
      attributes: ['id', 'name', 'admin', 'password_hash'],
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ message: 'Password does not match.' });
    }

    return res.json({
      access_token: jwt.sign(
        {
          id: user.id,
          data: user.admin,
        },
        authConfig.secret,
        {
          expiresIn: authConfig.expiresIn,
        }
      ),
    });
  }
}

export default new SessionController();
