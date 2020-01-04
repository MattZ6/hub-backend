import { where, fn, col } from 'sequelize';
import * as Yup from 'yup';

import MusicStyle from '../models/MusicStyle';

class StyleController {
  async index(_, res) {
    const styles = await MusicStyle.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });

    return res.status(200).json(styles);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .trim()
        .min(3),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors.' });
    }

    const name = req.body.name.trim();

    const exists =
      (await MusicStyle.count({
        where: where(fn('LOWER', col('name')), fn('LOWER', name)),
      })) === 1;

    if (exists) {
      return res.status(409).json({
        error: 'Music style already exists',
      });
    }

    const style = { name };

    await MusicStyle.create(style);

    return res.status(201).json();
  }
}

export default new StyleController();
