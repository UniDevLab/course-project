import { Application } from "express";
import { userRouter } from "./user.router";
import { queueRouter } from "./queue.router";
import { endpointsRouter } from "./endpoints.router";

export class AppRouters {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  init() {
    this.app.use("/user", userRouter);
    this.app.use("/queue", queueRouter);
    this.app.use("/endpoints", endpointsRouter);
  }
}
