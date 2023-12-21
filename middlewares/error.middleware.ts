import { CustomError } from "../constructors/error.constructor";
import { ResponseConstructor } from "../constructors/response.constructor";
import { NextFunction, Response, Request } from "express";

export const errorMiddleware = (
  err: Error | CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let code = 500;
  console.log(err);
  if (err instanceof CustomError) code = err.code;

  const result = ResponseConstructor.error<null>(err);
  res.status(code).json(result);
};
