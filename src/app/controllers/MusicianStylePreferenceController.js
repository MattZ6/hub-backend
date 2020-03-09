import UserStylePreference from '../models/UserStylePreference';
import MusicStyle from '../models/MusicStyle';

class MusicianStylePreferenceController {
  async index(req, res) {
    const { id: user_id } = req.params;

    const styles = await UserStylePreference.findAll({
      where: { user_id },
      attributes: ['id'],
      include: [
        {
          model: MusicStyle,
          as: 'style',
          attributes: ['name'],
        },
      ],
    });

    return res.status(200).json(styles);
  }
}

export default new MusicianStylePreferenceController();
