import * as Yup from 'yup';

import { UserMessages, VALIDATION_FAILS } from '../res/messages';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      passwordConfirmation: Yup.string().when('password', (password, field) =>
        password
          ? field
              .required(UserMessages.PASSWORD_CONFIRMATION_REQUIRED)
              .oneOf(
                [Yup.ref('password')],
                UserMessages.PASSWORD_CONFIRMATION_NOT_MATCH
              )
          : field
      ),
      password: Yup.string()
        .min(6, UserMessages.PASSWORD_MIN_LENGTH)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required(UserMessages.PASSWORD_REQUIRED) : field
        ),
      oldPassword: Yup.string().min(6, UserMessages.OLD_PASSWORD_MIN_LENGTH),
      email: Yup.string()
        .trim()
        .email(UserMessages.EMAIL_INVALID),
      name: Yup.string()
        .trim()
        .min(6, UserMessages.NAME_MIN_LENGTH),
    });

    await schema.validate(req.body);

    return next();
  } catch (error) {
    return res.status(422).json({ error: error.message || VALIDATION_FAILS });
  }
};
