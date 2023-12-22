import Joi from "joi";

export const CreateCenshareSchema = Joi.object({
  censhareUsername: Joi.string().trim().required().min(3),
  censharePassword: Joi.string().trim().required().min(3),
});

export const UpdateCenshareSchema = Joi.object({
  censhareUsername: Joi.string().trim().min(3),
  censharePassword: Joi.string().trim().min(3),
}).or("censhareUsername", "censharePassword");
