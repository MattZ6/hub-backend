import { Op } from 'sequelize';
import * as Yup from 'yup';

import MusicStyle from '../models/MusicStyle';
import BandStyle from '../models/BandStyle';
import Band from '../models/Band';

class BandStyleController {
  async store(req, res) {
    const paramsSchema = Yup.object().shape({
      bandId: Yup.number()
        .positive()
        .required(),
    });

    if (!(await paramsSchema.isValid(req.params)))
      return res.status(422).json({ error: 'Invalid band id' });

    const schema = Yup.object().shape({
      styles: Yup.array().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(422).json({ error: 'Validation fails' });

    const styles = [...new Set(req.body.styles)];

    /**
     * MusicStyle
     */

    const validStyles =
      (await MusicStyle.count({
        where: { id: { [Op.in]: styles } },
      })) === styles.length;

    if (!validStyles)
      return res.status(404).json({ error: 'Music style(s) not found' });

    /**
     * BandStyle
     */

    const result = (
      await BandStyle.findAll({
        where: { band_id: req.params.bandId },
        attributes: ['music_style_id'],
      })
    ).map(x => x.music_style_id);

    const stylesToSave = styles.filter(
      item => result.findIndex(x => x === item) === -1
    );

    if (stylesToSave.length === 0)
      return res.status(422).json({ error: 'Band already have this style(s)' });

    const newStyles = stylesToSave.map(x => ({
      band_id: +req.params.bandId,
      music_style_id: x,
    }));

    await Promise.all(newStyles.map(x => BandStyle.create(x)));

    return res.status(201).json();
  }

  async delete(req, res) {
    const paramsSchema = Yup.object().shape({
      bandId: Yup.number()
        .positive()
        .required(),
      id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await paramsSchema.isValid(req.params)))
      return res.status(422).json({ error: 'Invalid params' });

    const band_id = +req.params.bandId;
    const id = +req.params.id;

    const bandExists =
      (await Band.count({
        where: {
          id: band_id,
          leader_id: +req.userId,
        },
      })) === 1;

    if (!bandExists)
      return res
        .status(404)
        .json({ error: `There's no band with id ${band_id}` });

    const exists = (await BandStyle.count({ where: { id, band_id } })) === 1;

    if (!exists)
      return res
        .status(404)
        .json({ error: `There's no band style with id ${id}` });

    await BandStyle.destroy({ where: { id, band_id } });

    return res.status(204).json();
  }
}

export default new BandStyleController();
