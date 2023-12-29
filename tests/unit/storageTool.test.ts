import { StorageTool } from "../../src/broker/tools/storage.tool";
import { describe, expect, beforeEach, it, beforeAll } from "@jest/globals";
import { readFile } from "../tools/reader.tool";

const pathToFile = "tests/mocks/storageTool.json";
const { env, data } = readFile(pathToFile);

describe("StorageTool", () => {
  let storageTool: StorageTool<string>;

  beforeAll(() => {
    process.env = env;
  });

  beforeEach(() => {
    storageTool = new StorageTool<string>();
  });

  it("should initialize user and return the user object", async () => {
    const user = await storageTool.initUser(data.user_id);

    expect(user).toEqual({
      connection: expect.anything(),
      collection: expect.any(Object),
    });
    expect(storageTool.storage[data.user_id]).toEqual(user);
  });

  it("should create a collection key based on user_id and name", () => {
    const userId = "testUser";
    const collectionName = "testCollection";
    const collectionKey = storageTool.createCollectionKey(
      userId,
      collectionName
    );

    expect(collectionKey).toEqual(`${userId}_${collectionName}`);
  });
});
