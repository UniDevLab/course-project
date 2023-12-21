import { Broker } from "../broker/broker";
import { AxiosError } from "axios";
import { Channel, Connection, ConsumeMessage, Replies } from "amqplib";

export type Options = {
  user_id: string;
  name: string;
};

export type Queue = {
  channel: Channel | null;
  consumer: Replies.Consume | null;
};

export type Producer = {
  channel: Channel | null;
};

export type Collection<T> = {
  [key: string]: T | null;
};

export type User<T> = {
  connection: Connection | null;
  collection: Collection<T>;
};

export type Storage<T> = {
  [key: string]: User<T>;
};

export type QueueCallback = (
  options: Options,
  broker: Broker
) => ConsumerCallback;

export type ConsumerCallback = (msg: ConsumeMessage | null) => void;

export type ConsumerError = Error | AxiosError;

export type ErrorHandler = (user_id: string) => (error: any) => Promise<void>;

export type ConsumerUserData = {
  url: string;
  email: string;
  secret: string;
};
