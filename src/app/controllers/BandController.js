import { where, col, fn } from 'sequelize';
import * as Yup from 'yup';

import Band from '../models/Band';

class BandController {
  async index(req, res) {
    const MAX = 50;

    const paramsSchema = Yup.object().shape({
      limit: Yup.number().positive(),
      offset: Yup.number().positive(),
    });

    if (!(await paramsSchema.isValid(req.params)))
      return res.status(422).json({ error: 'Invalid params' });

    let limit = 10;

    if (req.params.limit)
      limit = req.params.limit > MAX ? MAX : +req.params.limit;

    const offset = req.params.limit || 0;

    const bands = await Band.findAll({
      attributes: ['id', 'name'],
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    return res.status(200).json(bands);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .trim()
        .min(3),
      // styles: Yup.array().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(422).json({ error: 'Validation errors.' });
    }

    const name = req.body.name.trim();

    const exists =
      (await Band.count({
        where: where(fn('LOWER', col('name')), fn('LOWER', name)),
      })) === 1;

    if (exists)
      return res.status(409).json({
        error: 'This band name is already taken',
      });

    const band = {
      leader_id: req.userId,
      name,
    };

    await Band.create(band);

    return res.status(201).json();
  }

  async update(req, res) {
    const paramsSchema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await paramsSchema.isValid(req.params))) {
      return res.status(422).json({ error: 'Id is invalid' });
    }

    const schema = Yup.object().shape({
      name: Yup.string()
        .trim()
        .min(3),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(422).json({ error: 'Validation errors' });
    }

    const band = await Band.findOne({
      where: {
        id: +req.params.id,
        leader_id: req.userId,
      },
    });

    if (!band)
      return res
        .status(404)
        .json({ error: `There's no band with id ${req.params.id}` });

    const name = req.body.name.trim();

    if (band.name.toLowerCase() !== name.toLowerCase()) {
      const exists =
        (await Band.count({
          where: where(fn('LOWER', col('name')), fn('LOWER', name)),
        })) === 1;

      if (exists)
        return res.status(409).json({
          error: 'This band name is already taken',
        });

      await band.update({ name });
    }

    return res.status(204).json();
  }

  async destroy(req, res) {
    const paramsSchema = Yup.object().shape({
      id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await paramsSchema.isValid(req.params)))
      return res.status(422).json({ error: 'Id is invalid' });

    const exists =
      (await Band.count({
        where: {
          id: req.params.id,
          leader_id: req.userId,
        },
      })) === 1;

    if (!exists)
      return res
        .status(404)
        .json({ error: `There's no band with id ${req.params.id}` });

    await Band.destroy({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(204).json();
  }
}
export default new BandController();
