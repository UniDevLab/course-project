import Joi from "joi";

const urlSchema = Joi.string()
  .uri({ scheme: ["https"] })
  .regex(/\/_functions\//)
  .regex(/\/[^/]+/)
  .regex(/\/[^/]+/);

export const CreateEndpointsSchema = Joi.object({
  upload: urlSchema.required(),
  update: urlSchema.required(),
  delete: urlSchema.required(),
  error: urlSchema.required(),
  dataTypes: Joi.array().items(Joi.string()).min(1).required(),
});

export const UpdateUriSchema = Joi.object({
  upload: urlSchema.optional(),
  update: urlSchema.optional(),
  delete: urlSchema.optional(),
  error: urlSchema.optional(),
  dataTypes: Joi.array().items(Joi.string()).min(1).required(),
}).or("upload", "update", "delete", "error", "dataType");
