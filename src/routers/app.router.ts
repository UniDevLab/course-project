import { wixRouter } from "./wix.router";
import { userRouter } from "./user.router";
import { Application } from "express";
import { queueRouter } from "./queue.router";
import { censhareRouter } from "./censhare.router";

export class AppRouters {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  init() {
    this.app.use("/wix", wixRouter);
    this.app.use("/user", userRouter);
    this.app.use("/queue", queueRouter);
    this.app.use("/censhare", censhareRouter);
  }
}
