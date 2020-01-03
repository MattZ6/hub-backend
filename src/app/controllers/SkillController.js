import Instrument from '../models/Instrument';
import InstrumentUserSkill from '../models/InstrumentUserSkill';

class SkillController {
  async index(req, res) {
    const skills = await InstrumentUserSkill.findAll({
      where: { user_id: req.userId },
      attributes: ['id'],
      include: [
        {
          model: Instrument,
          as: 'instrument',
          attributes: ['name', 'label'],
        },
      ],
    });

    return res.status(200).json(skills);
  }

  async store(req, res) {
    const { instrumentId } = req.body;

    // Instrument

    const instrumentExists =
      (await Instrument.count({
        where: {
          id: instrumentId,
        },
      })) === 1;

    if (!instrumentExists) {
      return res.status(404).json({
        error: 'Instrument not found',
      });
    }

    // InstrumentUserSkill

    const relationshipExists =
      (await InstrumentUserSkill.count({
        where: {
          user_id: req.userId,
          instrument_id: instrumentId,
        },
      })) === 1;

    if (relationshipExists) {
      return res.status(422).json({
        error: 'You already have this instrument saved to your preferences',
      });
    }

    await InstrumentUserSkill.create({
      user_id: req.userId,
      instrument_id: instrumentId,
    });

    return res.status(204).json();
  }

  async destroy(req, res) {
    const instrument_id = req.params.id;

    const numberOnly = new RegExp('^[0-9]*$').test(instrument_id);

    if (!numberOnly || instrument_id <= 0)
      return res.status(422).json({ error: 'Invalid params' });

    const skill = await InstrumentUserSkill.findOne({
      where: {
        user_id: req.userId,
        instrument_id,
      },
      attributes: ['id'],
    });

    if (!skill) {
      return res.status(404).json({
        error: 'You can only remove the skills you have',
      });
    }

    await InstrumentUserSkill.destroy({
      where: { id: skill.id },
    });

    return res.status(204).json();
  }
}

export default new SkillController();
