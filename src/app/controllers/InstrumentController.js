import * as Yup from 'yup';
import { where, fn, col } from 'sequelize';

import Instrument from '../models/Instrument';

class InstrumentController {
  async index(_, res) {
    const intruments = await Instrument.findAll({
      attributes: ['id', 'name', 'label'],
      order: [['name', 'ASC']],
    });

    return res.json(intruments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .trim()
        .min(3),
      label: Yup.string()
        .required()
        .trim()
        .min(3),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors.' });
    }

    const name = req.body.name.trim();

    const exists =
      (await Instrument.count({
        where: where(fn('LOWER', col('name')), fn('LOWER', name)),
      })) === 1;

    if (exists) {
      return res.status(409).json({
        error: 'This instrument already exists.',
      });
    }

    const instrument = {
      name,
      label: req.body.label.trim(),
    };

    await Instrument.create(instrument);

    return res.status(204).json();
  }
}

export default new InstrumentController();
