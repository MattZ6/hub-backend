import { where, fn, col } from 'sequelize';

import { UserMessages } from '../res/messages';

import returnToken from '../utils/token';
// import createRegion from '../services/createRegion';

import User from '../models/User';
import Region from '../models/Region';
import Avatar from '../models/Avatar';

class UserController {
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
      return res.status(404).json({ error: 'Localidade não encontrada' });
    }

    const {
      id,
      admin,
      first_skill_configuration,
      first_styles_configuration,
      whatsapp,
    } = await User.create({
      name,
      nickname,
      email,
      region_id: regionId,
      password: req.body.password,
    });

    const avatar = await Avatar.findOne({
      where: { user_id: id },
      attributes: ['id', 'name', 'url'],
    });

    const user = {
      id,
      name,
      nickname,
      email,
      whatsapp,
      first_skill_configuration,
      first_styles_configuration,
      region,
      avatar,
    };

    return res.status(201).json({
      access_token: returnToken(id, admin),
      user,
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

    /**
     * Region
     */

    const regionId = req.body.regionId || user.region_id;

    const region = await Region.findByPk(regionId, {
      attributes: ['id', 'name'],
    });

    if (!region) {
      return res.status(404).json({ error: 'Localidade não encontrada' });
    }

    const userToUpdate = {};

    if (req.body.name) {
      userToUpdate.name = req.body.name;
    }

    if (req.body.nickname) {
      userToUpdate.nickname = req.body.nickname;
    }

    if (req.body.email) {
      userToUpdate.email = req.body.email;
    }

    if (req.body.first_skill_configuration) {
      userToUpdate.first_skill_configuration =
        req.body.first_skill_configuration;
    }

    if (req.body.first_styles_configuration) {
      userToUpdate.first_styles_configuration =
        req.body.first_styles_configuration;
    }

    if (req.body.regionId) {
      userToUpdate.region_id = req.body.regionId;
    }

    // console.log(req.body.whatsapp);

    if (req.body.whatsapp) {
      userToUpdate.whatsapp = req.body.whatsapp;
    }

    if (req.body.removeWhatsApp) {
      userToUpdate.whatsapp = null;
    }

    if (req.body.passwordConfirmation) {
      userToUpdate.password = req.body.passwordConfirmation;
    }

    const _updatedUser = await user.update(userToUpdate);

    const avatar = await Avatar.findOne({
      where: { user_id: user.id },
      attributes: ['id', 'name', 'url'],
    });

    return res.status(200).json({
      id: _updatedUser.id,
      name: _updatedUser.name,
      nickname: _updatedUser.nickname,
      email: _updatedUser.email,
      first_skill_configuration: _updatedUser.first_skill_configuration,
      first_styles_configuration: _updatedUser.first_styles_configuration,
      whatsapp: _updatedUser.whatsapp,
      region,
      avatar,
    });
  }
}

export default new UserController();
