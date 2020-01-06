import * as Yup from 'yup';

import { UserMessages, VALIDATION_FAILS } from '../res/messages';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      password: Yup.string()
        .required(UserMessages.PASSWORD_REQUIRED)
        .trim()
        .min(6, UserMessages.PASSWORD_MIN_LENGTH),
      email: Yup.string()
        .email(UserMessages.EMAIL_INVALID)
        .required(UserMessages.EMAIL_REQUIRED),
    });

    await schema.validate(req.body);

    return next();
  } catch (error) {
    return res.status(422).json({ error: error.message || VALIDATION_FAILS });
  }
};
