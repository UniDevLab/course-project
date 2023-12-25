import { Channel, Replies } from "amqplib";
import { Options } from "./broker.types";
import { Broker } from "../../../broker/broker";
import { ConsumerCallback } from "./consumer.broker.types";

export type Queue = {
  channel: Channel | null;
  consumer: Replies.Consume | null;
};

export type QueueCallback = (
  options: Options,
  broker: Broker
) => ConsumerCallback;
