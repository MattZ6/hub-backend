import User from '../models/User';

import storeImage from '../services/storeImage';
import createOrUpdateAvatar from '../services/createOrUpdateAvatar';
import Region from '../models/Region';

class AvatarController {
  async store(req, res) {
    const { userId: user_id } = req;

    const { file, size, mimeType, ext } = req.body;

    const { name, path } = storeImage(file, ext, user_id);

    const user = await User.findByPk(user_id, {
      include: [
        {
          model: Region,
          as: 'region',
          attributes: ['id', 'name'],
        },
      ],
    });

    const avatar = await createOrUpdateAvatar({
      user_id,
      name,
      size,
      path,
      mimeType,
      ext,
    });

    const updatedUser = await user.update({ avatar_id: avatar.id });

    return res.status(201).json({
      id: updatedUser.id,
      name: updatedUser.name,
      nickname: updatedUser.nickname,
      email: updatedUser.email,
      whatsapp: updatedUser.whatsapp,
      first_skill_configuration: updatedUser.first_skill_configuration,
      first_styles_configuration: updatedUser.first_styles_configuration,
      region: user.region,
      avatar: { id: avatar.id, name: avatar.name, url: avatar.url },
    });
  }
}

export default new AvatarController();
