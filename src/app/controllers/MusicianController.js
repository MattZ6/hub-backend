import User from '../models/User';
import Instrument from '../models/Instrument';
import InstrumentUserSkill from '../models/InstrumentUserSkill';

class MusicianController {
  async index(req, res) {
    const { limit = 10, offset = 0 } = req.query;

    const users = await User.findAll({
      attributes: ['id', 'nickname'],
      limit,
      offset,
      include: [
        {
          model: InstrumentUserSkill,
          as: 'skills',
          attributes: ['id'],
          include: [
            {
              model: Instrument,
              as: 'instrument',
              attributes: ['id', 'label'],
            },
          ],
        },
      ],
    });

    return res.status(200).json(users);
  }
}

export default new MusicianController();
