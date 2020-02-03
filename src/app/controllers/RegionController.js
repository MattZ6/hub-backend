import { where, fn, col } from 'sequelize';
import * as Yup from 'yup';

import Region from '../models/Region';

class RegionController {
  async index(_, res) {
    const regions = await Region.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });

    return res.json(regions);
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

    const region = await Region.findOne({
      where: where(fn('LOWER', col('name')), fn('LOWER', name)),
      attributes: ['id'],
    });

    if (region) {
      return res.json({ id: region.id });
    }

    const { id } = await Region.create(req.body);

    return res.json({ id });
  }
}

export default new RegionController();
