import Joi from "joi";
import { ValidationRegExps } from "../consts/validation.const";

export const ChangePassword = Joi.object({
  oldPassword: Joi.string().trim().regex(ValidationRegExps.password).required(),
  newPassword: Joi.string().trim().regex(ValidationRegExps.password).required(),
});

export const ResetPassword = Joi.object({
  email: Joi.string().trim().regex(ValidationRegExps.email).required(),
  secret: Joi.string().trim().min(15).required(),
  newPassword: Joi.string().trim().regex(ValidationRegExps.password).required(),
});
