import { Broker } from "../broker/broker";
import { EndpointsService } from "./endpoints.service";
import { Notification } from "../types/censhare.types";
import { ConsumerTool } from "../broker/tools/consumer.tool";
import { InitializeService } from "./initialize.service";
import { NotificationService } from "./notification.service";

export class QueueService {
  private broker: Broker;
  private endpoints: EndpointsService;
  private consumerTool: ConsumerTool;
  private initializeService: InitializeService;
  private notificationService: NotificationService;

  constructor() {
    this.broker = new Broker();
    this.endpoints = new EndpointsService();
    this.consumerTool = new ConsumerTool();
    this.initializeService = new InitializeService();
    this.notificationService = new NotificationService();
  }

  private async handle<T>(name: string, user_id: string, messages: T[]) {
    if (!messages.length) return;

    const mainQueueOptions = { user_id, name };
    const errorQueueOptions = { user_id, name: "error" };
    const handler = this.consumerTool.callback.bind(this.consumerTool);
    await this.broker.setUserQueue(errorQueueOptions, handler);
    await this.broker.process(mainQueueOptions, messages, handler);
  }

  private async upload<T>(user_id: string, messages: T[]) {
    await this.handle("upload", user_id, messages);
  }

  private async update<T>(user_id: string, messages: T[]) {
    await this.handle("update", user_id, messages);
  }

  private async delete<T>(user_id: string, messages: T[]) {
    await this.handle("delete", user_id, messages);
  }

  async notify(user_id: string, notification: Notification) {
    const { dataTypes } = await this.endpoints.getByUserId(user_id);
    const assets = await this.notificationService.process(
      user_id,
      dataTypes,
      notification
    );
    const { updating, deleting } = assets;
    await this.update(user_id, updating);
    await this.delete(user_id, deleting);
  }

  async initialize(user_id: string) {
    const { dataTypes } = await this.endpoints.getByUserId(user_id);
    const assets = await this.initializeService.getAllAssets(
      user_id,
      dataTypes
    );
    await this.upload(user_id, assets);
  }
}
