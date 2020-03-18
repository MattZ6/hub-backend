import { writeFileSync } from 'fs';
import { resolve } from 'path';

export default function(file, ext, userId) {
  const name = `${String(userId)}${ext}`;

  const path = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', name);

  writeFileSync(path, file, 'base64');

  return { path, name };
}
