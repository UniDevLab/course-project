import { Asset } from "../../types/external/assets/assets.types";
import { Broker } from "../broker";
import { Options } from "../../types/external/broker/broker.types";
import { Failure } from "../../types/external/assets/collection.assets.types";
import { CustomError } from "../../constructors/error.constructor";
import { AssetService } from "../../assets/services/asset.service";
import { ConsumeMessage } from "amqplib";

export class ConsumerTool {
  private assetService: AssetService;

  constructor() {
    this.assetService = new AssetService();
  }

  private delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  private async handleError(
    options: Options,
    broker: Broker,
    message: ConsumeMessage,
    error: unknown
  ) {
    const queue = await broker.queues.get(options);
    const newMessage = [error];
    const errorOptions = { ...options, name: "error" };
    await broker.producers.sendMessage(newMessage, errorOptions);
    queue.channel.reject(message, false);
  }

  process =
    (options: Options, broker: Broker) =>
      async (msg: ConsumeMessage | null) => {
        try {
          if (!msg) throw new CustomError("Consumer", "Empty message", 500);

          const queue = await broker.queues.get(options);
          const data = broker.queues.parse<Asset[] & (Failure | Error)[]>(msg);
          const method = options.name as keyof AssetService;
          const failed = await this.assetService[method](options.user_id, data);

          if (failed.length) await this.processFailures(options, broker, failed);

          console.log("message");

          await this.delay(10000);
          queue.channel.ack(msg);
        } catch (error) {
          await this.handleError(options, broker, msg, error);
        }
      };

  private async processFailures(
    options: Options,
    broker: Broker,
    failures: Failure[]
  ) {
    const errorOptions = { ...options, name: "error" };
    await broker.producers.sendMessage(failures, errorOptions);
  }
}
