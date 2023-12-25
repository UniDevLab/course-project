import { ResponseConstructor } from "../constructors/response.constructor";
import { NextFunction, Response } from "express";

export const responseMiddleware =
  (cb: any) =>
    async (req: any, res: Response, next: NextFunction): Promise<void> => {
      try {
        const data = await cb(req);
        const responseBody = data ?? null;
        const result = ResponseConstructor.success(responseBody);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    };
