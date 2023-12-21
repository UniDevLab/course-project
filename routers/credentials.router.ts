import { Router } from "express";
import { CredentialsController } from "../controllers/credentials.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { responseMiddleware } from "../middlewares/response.middleware";
import { errorMiddleware } from "../middlewares/error.middleware";
import { UpdateCredentialsSchema } from "../validation/credentials.schema";
import { validate } from "../middlewares/validate.middleware";
import { checkCredentials } from "../middlewares/checkCredentials";

export const endpointsRouter = Router();

const сontroller = new CredentialsController();

endpointsRouter.get(
  "/",
  authenticate(true),
  responseMiddleware(сontroller.getByUserId.bind(сontroller)),
  errorMiddleware
);

endpointsRouter.post(
  "/update",
  validate(UpdateCredentialsSchema),
  checkCredentials,
  authenticate(true),
  responseMiddleware(сontroller.update.bind(сontroller)),
  errorMiddleware
);
