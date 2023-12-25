import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { QueueController } from "../controllers/queue.controller";
import { errorMiddleware } from "../middlewares/error.middleware";
import { responseMiddleware } from "../middlewares/response.middleware";
import { NotificationSchema } from "../validation/queue.schema";

export const queueRouter = Router();

const сontroller = new QueueController();

queueRouter.post(
  "/notify",
  validate(NotificationSchema),
  authenticate(true),
  responseMiddleware(сontroller.notify),
  errorMiddleware
);

queueRouter.post(
  "/initialize",
  authenticate(true),
  responseMiddleware(сontroller.initialize),
  errorMiddleware
);
