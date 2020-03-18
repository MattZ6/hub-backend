import Avatar from '../models/Avatar';

export default async function({ user_id, name, path, size, mimeType, ext }) {
  const avatar = await Avatar.findOne({ where: { user_id } });

  let _avatar = null;

  if (avatar) {
    _avatar = await avatar.update({
      name,
      size,
      mimeType,
      ext,
      path,
      user_id,
    });
  } else {
    _avatar = await Avatar.create({
      name,
      size,
      mimeType,
      ext,
      path,
      user_id,
    });
  }

  return _avatar;
}
