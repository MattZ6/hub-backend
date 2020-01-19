import User from '../models/User';
import Instrument from '../models/Instrument';
import UserSkill from '../models/UserSkill';

class MusicianController {
  async index(req, res) {
    const { limit = 10, offset = 0 } = req.query;

    const _users = await User.findAll({
      attributes: ['id', 'nickname'],
      limit,
      offset,
      include: [
        {
          model: UserSkill,
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

    const users = _users.map(user => {
      return {
        id: user.id,
        nickname: user.nickname,
        skills: user.skills.map(skill => ({
          id: skill.instrument.id,
          label: skill.instrument.label,
          skill_id: skill.id,
        })),
      };
    });

    return res.status(200).json(users);
  }

  async show(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'nickname', 'name'],
    });

    return res.status(200).json(user);
  }
}

export default new MusicianController();
