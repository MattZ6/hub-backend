import User from '../models/User';

class MusicianController {
  async index(req, res) {
    const {
      userId,
      query: { limit = 10, offset = 0, search = null },
    } = req;

    let query = `
                SELECT
                  Users.id AS id,
                  Users.name AS name
                FROM Users
                LEFT OUTER JOIN User_Skills ON User_Skills.user_id = Users.id
                LEFT OUTER JOIN Instruments ON Instruments.id = User_Skills.instrument_id
                WHERE Users.id != ${userId}
                `;

    if (search && search.trim().length > 0) {
      const words = search.toLowerCase().split(' ');

      query += ' AND ( ';

      words.forEach((word, i) => {
        query += `
              ( LOWER(Users.name) LIKE '%${word}%' OR LOWER(Instruments.label) LIKE '%${word}%' OR LOWER(Instruments.name) LIKE '%${word}%' ) ${
          i < words.length - 1 ? 'AND' : ''
        }
        `;
      });

      query += ' ) ';
    }

    query += `
              GROUP BY Users.id
              ORDER BY Users.name
              LIMIT ${limit}
              OFFSET ${offset}
              `;

    const [users] = await User.sequelize.query(query);

    // const users = [];

    // results.forEach(result => {
    //   const _i = users.findIndex(x => x.id === result.id);

    //   if (_i > -1) {
    //     users[_i].skills.push(result.skill);
    //   } else {
    //     users.push({
    //       id: result.id,
    //       name: result.name,
    //       skills: result.skill ? [result.skill] : [],
    //     });
    //   }
    // });

    return res.status(200).json(users);
  }

  async show(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'nickname', 'name', 'bio'],
    });

    return res.status(200).json(user);
  }
}

export default new MusicianController();
