import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const error = 'Unauthorized to access this resource.';

  if (!authHeader) return res.status(401).json({ error });

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;
    req.userAdmin = decoded.data;

    return next();
  } catch (err) {
    return res.status(401).json({ error });
  }
};
