import { Router } from "express";
import { errorMiddleware } from "../middlewares/error.middleware";
import { validate } from "../middlewares/validate.middleware";
import { responseMiddleware } from "../middlewares/response.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { ping } from "../middlewares/ping.middleware";
import { EndpointsController } from "../controllers/endpoints.controller";
import { UpdateUriSchema } from "../validation/endpoints.schema";

export const endpointsRouter = Router();

const сontroller = new EndpointsController();

endpointsRouter.get(
  "/",
  authenticate(true),
  responseMiddleware(сontroller.getByUserId.bind(сontroller)),
  errorMiddleware
);

endpointsRouter.post(
  "/update",
  validate(UpdateUriSchema),
  ping,
  authenticate(true),
  responseMiddleware(сontroller.update.bind(сontroller)),
  errorMiddleware
);
