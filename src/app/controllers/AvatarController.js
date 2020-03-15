import User from '../models/User';

import storeImage from '../services/storeImage';
import createOrUpdateAvatar from '../services/createOrUpdateAvatar';

class AvatarController {
  async store(req, res) {
    const { userId: user_id } = req;

    const { file, size, mimeType, ext } = req.body;

    const { name, path } = storeImage(file, ext, user_id);

    const user = await User.findByPk(user_id);

    const avatar = await createOrUpdateAvatar({
      user_id,
      name,
      size,
      path,
      mimeType,
      ext,
    });

    await user.update({ avatar_id: avatar.id });

    return res
      .status(201)
      .json({ id: avatar.id, name: avatar.name, url: avatar.url });
  }
}

export default new AvatarController();
