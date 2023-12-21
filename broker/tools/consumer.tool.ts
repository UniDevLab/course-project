import { Broker } from "../broker";
import { TokenTool } from "../../tools/token.tool";
import { MessageTool } from "./message.tool";
import { CustomError } from "../../constructors/error.constructor";
import { UserService } from "../../services/user.service";
import { ConsumeMessage } from "amqplib";
import { EndpointsService } from "../../services/endpoints.service";
import { CredentialsService } from "../../services/credentials.service";
import { ConsumerUserData, Options } from "../../types/broker.types";

export class ConsumerTool {
  private tokenTool: TokenTool;
  private messageTool: MessageTool;
  private userService: UserService;
  private endpointsService: EndpointsService;
  private credentialsService: CredentialsService;

  constructor() {
    this.tokenTool = new TokenTool();
    this.messageTool = new MessageTool();
    this.userService = new UserService();
    this.endpointsService = new EndpointsService();
    this.credentialsService = new CredentialsService();
  }

  private async getUserData(
    id: string,
    method: string
  ): Promise<ConsumerUserData> {
    const { email } = await this.userService.getById(id);
    const urls = await this.endpointsService.getByUserId(id);
    const { secret } = await this.credentialsService.getByUserId(id);
    const url = urls[method];
    return { email, url, secret };
  }

  private getAuthToken(_id: string, email: string, secret: string): string {
    const encoded = { _id, email };
    const token = this.tokenTool.getWixAuthToken(encoded, secret);
    return token;
  }

  private validateConsumeMessage(message: ConsumeMessage): void {
    if (!message) {
      throw new CustomError("Consumer Error", "Empty message in consumer", 500);
    }

    return;
  }

  private sendError = async (
    broker: Broker,
    options: Options,
    error: any
  ): Promise<void> => {
    const message = { error: error.message };
    const errorOptions = { ...options, name: "error" };
    await broker.producers.sendMessage(message, errorOptions);
  };

  private async handleCallbackError(
    broker: Broker,
    options: Options,
    msg: ConsumeMessage,
    error: any
  ): Promise<void> {
    const queue = await broker.queues.get(options);
    await this.sendError(broker, options, error);
    queue.channel.reject(msg, false);
  }

  callback =
    (options: Options, broker: Broker) =>
    async (msg: ConsumeMessage | null) => {
      try {
        this.validateConsumeMessage(msg);
        const { user_id, name } = options;
        const queue = await broker.queues.get(options);
        const content = broker.queues.parse(msg);
        const { email, url, secret } = await this.getUserData(user_id, name);
        const token = this.getAuthToken(user_id, email, secret);
        const isResendable = await this.messageTool.send(url, content, token);

        if (!isResendable) return queue.channel.ack(msg);

        await this.messageTool.delay(180000);
        queue.channel.nack(msg);
      } catch (error: any) {
        console.log("Consumer Error", error);
        await this.handleCallbackError(broker, options, msg, error);
      }
    };
}
