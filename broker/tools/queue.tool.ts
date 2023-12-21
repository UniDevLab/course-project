import { StorageTool } from "./storage.tool";
import { ConsumerCallback, Options, Queue } from "../../types/broker.types";

export class QueueTool extends StorageTool<Queue> {
  private readonly queueOptions = {
    durable: true,
    autoDelete: true,
  };

  private readonly consumerOptions = {
    noAck: false,
  };

  constructor() {
    super();
  }

  async create(options: Options) {
    const { user_id, name } = options;
    const { collection, connection } = await this.getUser(user_id);
    const queueName = this.createCollectionKey(user_id, name);
    const channel = await this.createChannel(queueName, connection, collection);
    await channel.assertQueue(queueName, this.queueOptions);
    collection[queueName] = { channel, consumer: null };
    console.log("Queue Create", this.storage);
  }

  async get(options: Options) {
    const { user_id, name } = options;
    const queueName = this.createCollectionKey(user_id, name);
    const { collection } = await this.getUser(user_id);

    if (!collection[queueName]) await this.create(options);

    return collection[queueName];
  }

  async setConsumer(options: Options, queue: Queue, cb: ConsumerCallback) {
    if (queue.consumer) return;

    const queueName = this.createCollectionKey(options.user_id, options.name);
    const consumer = await queue.channel.consume(
      queueName,
      cb,
      this.consumerOptions
    );
    queue.consumer = consumer;
  }
}
