import Joi from "joi";

export const CreateWixSchema = Joi.object({
  apiKey: Joi.string().required(),
  siteId: Joi.string().required(),
  dataTypes: Joi.array().items(Joi.string()).min(1).required(),
});

export const UpdateWixSchema = Joi.object({
  apiKey: Joi.string().optional(),
  siteId: Joi.string().optional(),
  dataTypes: Joi.array().items(Joi.string()).min(1),
}).or("apiKey", "siteId", "dataType");
