import { where, fn, col } from 'sequelize';

import { UserMessages } from '../res/messages';

import returnToken from '../utils/token';

import User from '../models/User';
import Region from '../models/Region';

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
    const { regionId } = req.body;

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

    const region = await Region.findByPk(regionId, {
      attributes: ['id', 'name'],
    });

    if (!region) {
      return res.status(404).json({
        error: 'Você precisa informar uma cidade válida',
      });
    }

    const {
      id,
      admin,
      first_skill_configuration,
      first_styles_configuration,
    } = await User.create({
      name,
      nickname,
      email,
      region_id: regionId,
      password: req.body.password,
    });

    const user = {
      id,
      name,
      nickname,
      first_skill_configuration,
      first_styles_configuration,
      region,
      email,
    };

    return res.status(201).json({
      access_token: returnToken(id, admin),
      user,
    });
  }

  async update(req, res) {
    const { email, oldPassword, regionId } = req.body;

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

    if (regionId) {
      const exists = (await Region.count({ where: { id: regionId } })) === 1;

      if (!exists) {
        return res.status(404).json({
          error: 'Você precisa informar uma cidade válida',
        });
      }
    }

    const {
      id,
      name,
      nickname,
      first_skill_configuration,
      first_styles_configuration,
      region_id,
      email: updatedEmail,
    } = await user.update(req.body);

    const region = await Region.findByPk(region_id, {
      attributes: ['id', 'name'],
    });

    return res.status(200).json({
      id,
      name,
      nickname,
      first_skill_configuration,
      first_styles_configuration,
      email: updatedEmail,
      region,
    });
  }
}

export default new UserController();
