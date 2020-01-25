import UserSkill from '../models/UserSkill';
import Instrument from '../models/Instrument';

class MusicianSkillController {
  async index(req, res) {
    const { id: user_id } = req.params;

    const _skills = await UserSkill.findAll({
      where: { user_id },
      attributes: ['id', 'skill_level'],
      include: [
        {
          model: Instrument,
          as: 'instrument',
          attributes: ['label'],
        },
      ],
    });

    function returnSkillLevel(level) {
      if (level === 1) {
        return 'Iniciante';
      }
      if (level === 2) {
        return 'Intermediário';
      }
      return 'Profissional';
    }

    const skills = _skills.map(x => {
      return {
        id: x.id,
        skill_level: x.skill_level,
        skill_level_label: returnSkillLevel(x.skill_level),
        instrument_label: x.instrument.label,
      };
    });

    return res.status(200).json(skills);
  }
}

export default new MusicianSkillController();
