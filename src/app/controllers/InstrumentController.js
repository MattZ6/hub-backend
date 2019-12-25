import * as Yup from 'yup';

import Instrument from '../models/Instrument';

class InstrumentController {
  async index(_, res) {
    const intruments = await Instrument.findAll({
      attributes: ['id', 'name'],
    });

    return res.json(intruments);
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

    const instrument = {
      name: req.body.name.trim(),
    };

    return res.json(instrument);
  }
}

export default new InstrumentController();
