import { Helpers } from "../../src/broker/tools/helpers";
import { ConsumeMessage } from "amqplib";
import { describe, expect, beforeEach, it } from "@jest/globals";

describe("Helpers", () => {
  let helpers: Helpers;

  beforeEach(() => {
    helpers = new Helpers();
  });

  describe("toBuffer", () => {
    it("should convert data to Buffer", () => {
      const data = { key: "value" };
      const buffer = helpers.toBuffer(data);

      expect(buffer).toBeDefined();
      expect(buffer).toBeInstanceOf(Buffer);
    });
  });

  describe("parse", () => {
    it("should parse ConsumeMessage content to object", () => {
      const message: ConsumeMessage = {
        content: Buffer.from('{"key":"value"}'),
        fields: {
          consumerTag: 'consumerTag',
          deliveryTag: 1,
          redelivered: false,
          exchange: 'exchange',
          routingKey: 'routingKey'
        },
        properties: {
            contentType: 'application/json',
            contentEncoding: 'utf-8',
            headers: {},
            deliveryMode: 2,
            priority: undefined,
            correlationId: undefined,
            replyTo: undefined,
            expiration: undefined,
            messageId: undefined,
            timestamp: undefined,
            type: undefined,
            userId: undefined,
            appId: undefined,
            clusterId: undefined
        }
      };
      const parsed = helpers.parse(message);

      expect(parsed).toEqual({ key: "value" });
    });
  });

  describe("splitMessages", () => {
    it("should split an array into chunks of size 450", () => {
        const messages = Array.from({ length: 1350 }, (_, index) => index + 1);
        const chunks = helpers.splitMessages(messages);
    
        expect(chunks).toHaveLength(3);
        expect(chunks[0]).toHaveLength(450);
        expect(chunks[1]).toHaveLength(450);
        expect(chunks[2]).toHaveLength(450);
      });
    
      it("should split an array with a remainder into chunks", () => {
        const messages = Array.from({ length: 1001 }, (_, index) => index + 1);
        const chunks = helpers.splitMessages(messages);
    
        expect(chunks).toHaveLength(3);
        expect(chunks[0]).toHaveLength(450);
        expect(chunks[1]).toHaveLength(450);
        expect(chunks[2]).toHaveLength(101);
      });
    
      it("should handle an array smaller than CHUNK_SIZE", () => {
        const messages = [1, 2, 3, 4, 5];
        const chunks = helpers.splitMessages(messages);
    
        expect(chunks).toHaveLength(1);
        expect(chunks[0]).toEqual([1, 2, 3, 4, 5]);
      });
  });
});
