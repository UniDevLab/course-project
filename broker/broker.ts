import { Helpers } from "./tools/helpers";
import { QueueTool } from "./tools/queue.tool";
import { CustomError } from "../constructors/error.constructor";
import { ProducerTool } from "./tools/producer.tool";
import { Options, QueueCallback } from "../types/broker.types";

export class Broker {
  helpers: Helpers;
  queues: QueueTool;
  producers: ProducerTool;

  constructor() {
    this.helpers = new Helpers();
    this.queues = new QueueTool();
    this.producers = new ProducerTool();
  }

  async setUserQueue(options: Options, fn: QueueCallback) {
    const queue = await this.queues.get(options);

    const cb = fn(options, this);
    await this.queues.setConsumer(options, queue, cb);
  }

  async process<T>(options: Options, messages: T[], fn: QueueCallback) {
    try {
      await this.setUserQueue(options, fn);
      const partitions = this.helpers.splitMessages(messages);

      for (const partition of partitions) {
        await this.producers.sendMessage(partition, options);
      }
    } catch (error) {
      console.log(error);
      throw new CustomError("Queue Error", "Unexpected error!", 500);
    }
  }
}
