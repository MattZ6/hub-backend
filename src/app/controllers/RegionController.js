import * as Yup from 'yup';

import Region from '../models/Region';
import createRegion from '../services/createRegion';

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

    const region = await createRegion(req.body.name);

    return res.json(region);
  }
}

export default new RegionController();
