import * as Yup from 'yup';

import { UserMessages, VALIDATION_FAILS } from '../res/messages';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      // location: Yup.string()
      //   .required('A cidade é obrigatória')
      //   .trim()
      //   .min(6, 'A cidade precisa de no mínimo 6 caracteres'),
      passwordConfirmation: Yup.string()
        .required(UserMessages.PASSWORD_CONFIRMATION_REQUIRED)
        .oneOf(
          [Yup.ref('password')],
          UserMessages.PASSWORD_CONFIRMATION_NOT_MATCH
        ),
      password: Yup.string()
        .required(UserMessages.PASSWORD_REQUIRED)
        .trim()
        .min(6, UserMessages.PASSWORD_MIN_LENGTH),
      email: Yup.string()
        .email(UserMessages.EMAIL_INVALID)
        .required(UserMessages.EMAIL_REQUIRED),
      nickname: Yup.string()
        .required(UserMessages.NICKNAME_REQUIRED)
        .trim()
        .min(3, UserMessages.NICKNAME_MIN_LENGTH),
      name: Yup.string()
        .required(UserMessages.NAME_REQUIRED)
        .trim()
        .min(6, UserMessages.NAME_MIN_LENGTH),
    });

    await schema.validate(req.body);

    return next();
  } catch (error) {
    return res.status(422).json({ error: error.message || VALIDATION_FAILS });
  }
};
