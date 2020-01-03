import User from '../models/User';
import Instrument from '../models/Instrument';
import InstrumentUserSkill from '../models/InstrumentUserSkill';

class MusicianController {
  async index(req, res) {
    const { offset = 0, limit = 10 } = req.params;

    const users = await User.findAll({
      attributes: ['id', 'nickname'],
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
      limit,
      offset,
    });

    return res.status(200).json(users);
  }
}

export default new MusicianController();
