import { CenshareValidator } from "../validation/validators/censhare.validator";
import { NextFunction, Response, Request } from "express";

const validator = new CenshareValidator();

export const checkCredentials = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = req;
    const { censhareUsername, censharePassword } = body.credentials;
    await validator.checkCredentials(censhareUsername, censharePassword);
    next();
  } catch (error) {
    next(error);
  }
};
