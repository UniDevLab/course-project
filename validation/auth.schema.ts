import Joi from "joi";
import { ValidationRegExps } from "../consts/validation.const";
import { CreateCredentialsSchema } from "./credentials.schema";
import { CreateEndpointsSchema } from "./endpoints.schema";

export const LoginAndInitialStepSchema = Joi.object({
  email: Joi.string().trim().regex(ValidationRegExps.email).required(),
  password: Joi.string().trim().regex(ValidationRegExps.password).required(),
});

export const FinalStepSchema = Joi.object({
  credentials: CreateCredentialsSchema,
  endpoints: CreateEndpointsSchema,
});

export const RefreshTokensSchema = Joi.object({
  refreshToken: Joi.string().trim().min(15).required(),
});
