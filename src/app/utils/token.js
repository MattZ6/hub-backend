import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

export default function returnToken(userId, isUserAdmin) {
  return jwt.sign(
    {
      id: userId,
      data: isUserAdmin,
    },
    authConfig.secret,
    {
      expiresIn: authConfig.expiresIn,
    }
  );
}
