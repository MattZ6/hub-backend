import Instrument from '../models/Instrument';
import UserSkill from '../models/UserSkill';
import User from '../models/User';

class SkillController {
  async index(req, res) {
    const _skills = await UserSkill.findAll({
      where: { user_id: req.userId },
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

  async store(req, res) {
    const SkillLevel = {
      BEGINNER: 1,
      INTERMEDIATE: 2,
      PROFESSIONAL: 3,
    };

    const { instruments } = req.body;

    if (!instruments)
      return res
        .status(422)
        .json({ error: 'The instruments list is required' });

    if (!Array.isArray(instruments))
      return res
        .status(422)
        .json({ error: 'The instruments must be an array' });

    if (instruments.length === 0)
      return res
        .status(422)
        .json({ error: 'The instruments list must contain one id' });

    const regex = new RegExp('^[1-9]*$');

    const invalidId =
      instruments.findIndex(x => !regex.test(x.instrumentId)) > -1;

    if (invalidId)
      return res
        .status(422)
        .json({ error: 'The instrument id must be a number' });

    const invalidSkillLevel =
      instruments.findIndex(
        x =>
          Number(x.skillLevel) !== SkillLevel.BEGINNER &&
          Number(x.skillLevel) !== SkillLevel.INTERMEDIATE &&
          Number(x.skillLevel) !== SkillLevel.PROFESSIONAL
      ) > -1;

    if (invalidSkillLevel)
      return res.status(422).json({ error: 'The skill level is out of range' });

    /**
     * Instrument
     */

    const removeDuplicatedValues = list => {
      const newList = [];

      list.forEach(item => {
        const exists =
          newList.findIndex(x => x.instrumentId === item.instrumentId) === -1;

        if (exists) {
          newList.push(item);
        }
      });

      return newList;
    };

    const unique = removeDuplicatedValues(instruments);

    const inQuery = unique.map(x => x.instrumentId).join(', ');

    const instrumentsQuery = `
                              SELECT COUNT(*) FROM instruments
                              WHERE instruments.id IN (${inQuery})`;

    const [[{ count: qtdIntruments }]] = await Instrument.sequelize.query(
      instrumentsQuery
    );

    if (Number(qtdIntruments) !== unique.length)
      return res.status(404).json({
        error: 'The list contains instruments that not exists',
      });

    /**
     * UserSkill
     */

    const skillsQuery = `
                          SELECT instrument_id FROM user_skills
                          WHERE user_skills.user_id = ${req.userId}
                        `;

    const [result] = await UserSkill.sequelize.query(skillsQuery);

    const skillsToSave = unique.filter(
      x => result.findIndex(y => y.instrument_id === x.instrumentId) === -1
    );

    if (skillsToSave.length === 0)
      return res.status(422).json({ error: "You're already has this skills" });

    const skills = skillsToSave.map(x => ({
      user_id: req.userId,
      instrument_id: x.instrumentId,
      skill_level: x.skillLevel,
    }));

    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'first_skill_configuration'],
    });

    await user.update({ first_skill_configuration: true });

    await Promise.all(skills.map(skill => UserSkill.create(skill)));

    return res.status(204).json();
  }

  async destroy(req, res) {
    const { id } = req.params;

    const numberOnly = new RegExp('^[0-9]*$').test(id);

    if (!numberOnly || id <= 0)
      return res.status(422).json({ error: 'Invalid params' });

    const exists =
      (await UserSkill.count({
        where: {
          user_id: req.userId,
          id,
        },
      })) === 1;

    if (!exists) {
      return res.status(404).json({
        error: 'You can only remove the skills you have',
      });
    }

    await UserSkill.destroy({ where: { id } });

    return res.status(204).json();
  }
}

export default new SkillController();
