import User from '../models/User';

class MusicianController {
  async index(req, res) {
    const MAX_QTD = 100;
    const onlyNumberRegex = /^[0-9]{1,}$/;

    const {
      styles = null,
      skills = null,
      levels = null,
      limit = 10,
      offset = 0,
      search = null,
    } = req.query;

    let styleIds = [];
    let instrumentIds = [];
    let skillLevels = [];

    if (styles) {
      const _stylesAux = (Array.isArray(styles) ? styles : [styles]).filter(x =>
        x.trim()
      );

      if (_stylesAux.map(x => Number(x)).some(x => !onlyNumberRegex.test(x)))
        return res
          .status(400)
          .json({ error: 'O id do estilo deve ser um número' });

      styleIds = [..._stylesAux];
    }

    if (skills) {
      const _skillsAux = (Array.isArray(skills) ? skills : [skills]).filter(x =>
        x.trim()
      );

      if (_skillsAux.map(x => Number(x)).some(x => !onlyNumberRegex.test(x)))
        return res
          .status(400)
          .json({ error: 'O id do instrumento deve ser um número' });

      instrumentIds = [..._skillsAux];
    }

    if (levels) {
      const _levelsAux = (Array.isArray(levels) ? levels : [levels]).filter(x =>
        x.trim()
      );

      const rangeRegex = /^[1-3]{1,}$/;

      if (_levelsAux.map(x => Number(x)).some(x => !rangeRegex.test(x)))
        return res
          .status(400)
          .json({ error: 'Um ou mais níveis de habilidade não são válidos' });

      skillLevels = [..._levelsAux];
    }

    const offsetValue = offset > 0 ? offset : 0;

    let limitValue = limit <= 0 ? 0 : limit;

    if (limit >= MAX_QTD) {
      limitValue = MAX_QTD;
    }

    let _query = `
      SELECT
          Users.id AS id,
          Users.name AS name,
          visible_skills.label AS skills
      FROM Users
      LEFT JOIN (
          SELECT User_Skills.user_id, string_agg(instruments.label, ', ' ORDER BY instruments.label) AS label
          FROM User_Skills
          INNER JOIN Instruments ON Instruments.id = User_Skills.instrument_id
          GROUP BY User_Skills.user_id
      ) AS visible_skills ON visible_skills.user_id = users.id`;

    if (styleIds.length > 0) {
      _query += `
        LEFT JOIN User_Style_Preferences ON User_Style_Preferences.user_id = Users.id
        LEFT JOIN Music_Styles ON Music_Styles.id = User_Style_Preferences.music_style_id
      `;
    }

    if (instrumentIds.length > 0) {
      _query += `
        LEFT JOIN User_Skills ON User_Skills.user_id = Users.id
        LEFT JOIN Instruments ON Instruments.id = User_Skills.instrument_id
      `;
    }

    _query += `
      WHERE Users.id != ${req.userId} ${
      styleIds.length > 0
        ? `AND Music_Styles.id IN (${styleIds.join(',')})`
        : ''
    } ${
      instrumentIds.length > 0
        ? `AND Instruments.id IN (${instrumentIds.join(',')})`
        : ''
    } ${
      skillLevels.length > 0
        ? `AND User_Skills.skill_level IN (${skillLevels.join(',')})`
        : ''
    }
    `;

    _query += `
      GROUP BY Users.id, visible_skills.label
      ORDER BY Users.name
      LIMIT ${limitValue}
      OFFSET ${offsetValue}
    `;

    const [_users] = await User.sequelize.query(_query);

    const users = _users.map(x => {
      if (x.skills) {
        const skillStr = `${x.skills}`;

        const index = skillStr.lastIndexOf(', ');

        const formatedSkills =
          index > -1
            ? skillStr.substr(0, index) +
              skillStr.substr(index).replace(', ', ' e ')
            : skillStr;

        x.skills = `${formatedSkills
          .substr(0, 1)
          .toUpperCase()}${formatedSkills.substr(1)}`;
      }

      return x;
    });

    return res.status(200).json(users);

    // let query = `
    //             SELECT
    //               Users.id AS id,
    //               Users.name AS name,
    //               string_agg(Instruments.label, ', ') AS skills
    //             FROM Users
    //             LEFT OUTER JOIN User_Skills ON User_Skills.user_id = Users.id
    //             LEFT OUTER JOIN Instruments ON Instruments.id = User_Skills.instrument_id
    //             WHERE Users.id != ${req.userId}
    //             `;

    // if (search && search.trim().length > 0) {
    //   const words = search.toLowerCase().split(' ');

    //   query += ' AND ( ';

    //   words.forEach((word, i) => {
    //     query += `
    //           ( LOWER(Users.name) LIKE '%${word}%' OR LOWER(Instruments.label) LIKE '%${word}%' OR LOWER(Instruments.name) LIKE '%${word}%' ) ${
    //       i < words.length - 1 ? 'AND' : ''
    //     }
    //     `;
    //   });

    //   query += ' ) ';
    // }

    // query += `
    //           GROUP BY Users.id, Users.name
    //           ORDER BY Users.name
    //           LIMIT ${limit}
    //           OFFSET ${offset}
    //           `;
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
