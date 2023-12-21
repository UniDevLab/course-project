import { UriValidator } from "../validation/validators/endpoints.validator";
import { NextFunction, Request, Response } from "express";

const validator = new UriValidator();

export const ping = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = req;
    const { endpoints } = body;
    for (const field in endpoints) {
      const value = endpoints[field];

      if (!value.includes("http") || Array.isArray(value)) continue;

      await validator.ping(value);
    }

    next();
  } catch (error) {
    next(error);
  }
};
