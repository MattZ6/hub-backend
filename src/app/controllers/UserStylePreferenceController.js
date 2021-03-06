import { Op } from 'sequelize';
import * as Yup from 'yup';

import User from '../models/User';
import MusicStyle from '../models/MusicStyle';
import UserStylePreference from '../models/UserStylePreference';

class UserStylePreferenceController {
  async index(req, res) {
    const preferences = await UserStylePreference.findAll({
      where: { user_id: req.userId },
      attributes: ['id'],
      include: [
        {
          model: MusicStyle,
          as: 'style',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.status(200).json(preferences);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      styles: Yup.array().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(422).json({ error: 'Validation errors' });

    const styles = [...new Set(req.body.styles)];

    /**
     * MusicStyle
     */

    const musicStyles = await MusicStyle.findAll({
      where: { id: { [Op.in]: styles } },
      attributes: ['id', 'name'],
    });

    if (musicStyles.length === 0)
      return res.status(404).json({ error: 'Music style not found' });

    /**
     * UserStylePreference
     */

    const result = (
      await UserStylePreference.findAll({
        where: { user_id: req.userId },
        attributes: ['music_style_id'],
      })
    ).map(x => x.music_style_id);

    const preferencesToSave = styles.filter(
      item => result.findIndex(x => x === item) === -1
    );

    if (preferencesToSave.length === 0)
      return res
        .status(422)
        .json({ error: "You're already has this preferences" });

    const user = await User.findByPk(req.userId);

    await user.update({ first_styles_configuration: true });

    const preferences = preferencesToSave.map(x => ({
      user_id: req.userId,
      music_style_id: x,
    }));

    const _preferences = await Promise.all(
      preferences.map(preference => UserStylePreference.create(preference))
    );

    const newUserPreferences = _preferences.map(p => ({
      id: p.id,
      style: musicStyles.find(m => m.id === p.music_style_id),
    }));

    return res.status(201).json(newUserPreferences);
  }

  async destroy(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.params)))
      return res.status(422).json({ error: 'Validation errors' });

    const { id } = req.params;

    const exists =
      (await UserStylePreference.count({
        where: {
          user_id: req.userId,
          id,
        },
      })) === 1;

    if (!exists) {
      return res.status(404).json({
        error: 'You can only remove the style preferences you have',
      });
    }

    await UserStylePreference.destroy({ where: { id } });

    return res.status(204).json();
  }
}

export default new UserStylePreferenceController();
