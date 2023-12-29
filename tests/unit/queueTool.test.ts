import { QueueTool } from "../../src/broker/tools/queue.tool";
import {
  describe,
  expect,
  beforeEach,
  it,
  jest,
  beforeAll,
} from "@jest/globals";
import { readFile } from "../tools/reader.tool";

const pathToFile = "tests/mocks/queueTool.json";
const { env, data } = readFile(pathToFile);

describe("QueueTool", () => {
  let queueTool: QueueTool;

  const { options } = data;
  const { user_id, name } = options;

  beforeAll(() => {
    process.env = env;
  });

  beforeEach(() => {
    queueTool = new QueueTool();
  });

  it("should create a queue with the specified options", async () => {
    await queueTool.create(options);

    const { collection } = await queueTool.getUser(user_id);
    const queueName = queueTool.createCollectionKey(user_id, name);

    expect(collection[queueName]).toEqual({
      channel: expect.anything(),
      consumer: null,
    });
  });

  it("should get an existing queue or create a new one if not present", async () => {
    const queue = await queueTool.get(options);

    expect(queue?.channel).toBeDefined();
  });

  it("should set a consumer for the specified queue with the provided callback", async () => {
    const queue = await queueTool.get(options);

    const cb = jest.fn();
    await queueTool.setConsumer(options, queue!, cb);

    expect(queue!.consumer).not.toBeNull();
  });
});
