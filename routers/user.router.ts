import { Router } from "express";
import {
  FinalStepSchema,
  LoginAndInitialStepSchema,
  RefreshTokensSchema,
} from "../validation/auth.schema";
import { ping } from "../middlewares/ping.middleware";
import { UserController } from "../controllers/user.controller";
import { errorMiddleware } from "../middlewares/error.middleware";
import { validate } from "../middlewares/validate.middleware";
import { checkExistance } from "../middlewares/existance.middleware";
import { responseMiddleware } from "../middlewares/response.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { ChangePassword, ResetPassword } from "../validation/user.schema";

export const userRouter = Router();

const controller = new UserController();

userRouter.post(
  "/registration/step-one",
  validate(LoginAndInitialStepSchema),
  checkExistance({
    isRequired: false,
    fn: controller.getByEmail.bind(controller),
  }),
  responseMiddleware(controller.initRegistration.bind(controller)),
  errorMiddleware
);

userRouter.post(
  "/registration/step-two",
  validate(FinalStepSchema),
  ping,
  authenticate(false),
  checkExistance({
    isRequired: true,
    fn: controller.getById.bind(controller),
  }),
  responseMiddleware(controller.finishRegistration.bind(controller)),
  errorMiddleware
);

userRouter.post(
  "/login",
  validate(LoginAndInitialStepSchema),
  checkExistance({
    isRequired: true,
    fn: controller.getByEmail.bind(controller),
  }),
  responseMiddleware(controller.login.bind(controller)),
  errorMiddleware
);

userRouter.post(
  "/refresh",
  validate(RefreshTokensSchema),
  responseMiddleware(controller.refresh.bind(controller)),
  errorMiddleware
);

userRouter.put(
  "/password/change",
  validate(ChangePassword),
  authenticate(true),
  responseMiddleware(controller.changePassword.bind(controller)),
  errorMiddleware
);

userRouter.put(
  "/password/reset",
  validate(ResetPassword),
  checkExistance({
    isRequired: true,
    fn: controller.getByEmail.bind(controller),
  }),
  responseMiddleware(controller.resetPassword.bind(controller)),
  errorMiddleware
);

userRouter.delete(
  "/delete",
  authenticate(true),
  responseMiddleware(controller.delete.bind(controller)),
  errorMiddleware
);
