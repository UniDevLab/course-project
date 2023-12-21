import Joi from "joi";

export const CreateCredentialsSchema = Joi.object({
  secret: Joi.string().trim().required().min(10),
  censhareUsername: Joi.string().trim().required().min(3),
  censharePassword: Joi.string().trim().required().min(3),
});

export const UpdateCredentialsSchema = Joi.object({
  secret: Joi.string().trim().min(10),
  censhareUsername: Joi.string().trim().min(3),
  censharePassword: Joi.string().trim().min(3),
}).or("secret", "censhareUsername", "censharePassword");
