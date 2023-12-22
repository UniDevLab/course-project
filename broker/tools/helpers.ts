import amqplib, { Connection, ConsumeMessage } from "amqplib";

export class Helpers {
  private tool: any;
  private uri: string;

  constructor() {
    this.tool = amqplib;
    this.uri = process.env.RABBIT_MQ_URI;
  }

  async createConnection<T>(user_id: string, storage: T) {
    const connection = await this.tool.connect(this.uri);
    const handler = this.connectionErrorHandler(user_id, storage);
    connection.on("error", handler);
    connection.on("close", handler);
    return connection;
  }

  async createChannel<T>(name: string, connection: Connection, collection: T) {
    const channel = await connection.createChannel();
    const handler = this.channelErrorHandler(name, collection);
    channel.on("close", handler);
    return channel;
  }

  toBuffer(data: any): Buffer {
    const stringified = JSON.stringify(data);
    return Buffer.from(stringified);
  }

  parse<T>(message: ConsumeMessage): T {
    const stringified = message.content.toString();
    return JSON.parse(stringified);
  }

  splitMessages<T>(messages: T[]): T[][] {
    const result: T[][] = [];
    const CHUNK_SIZE = 450;

    for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
      const chunk = messages.slice(i, i + CHUNK_SIZE);
      result.push(chunk);
    }

    return result;
  }

  connectionErrorHandler =
    (user_id: string, storage: any) => async (_: any) => {
      storage[user_id] = null;
    };

  channelErrorHandler = (name: string, collection: any) => async (_: any) => {
    collection[name] = null;
  };
}
