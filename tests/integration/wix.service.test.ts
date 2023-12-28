import { readFile } from "../tools/reader.tool";
import { createUser, deleteUser } from "../tools/user.tool";
import { WixService } from "../../src/services/wix.service";
import {
  closeDBConnection,
  connectDB,
} from "../../src/database/database.connection";
import { describe, expect, beforeAll, afterAll, test } from "@jest/globals";

let user_id: string;
let service: WixService;

const pathToFile = "tests/mocks/wixService.json";
const { data, env, account } = readFile(pathToFile);

beforeAll(async () => {
  process.env = env;
  await connectDB();
  service = new WixService();
  user_id = await createUser(account);
});

afterAll(async () => {
  await deleteUser(user_id);
  await closeDBConnection();
});

describe("WixService Integration Tests", () => {
  test(".getByUserId()", async () => {
    const created = await service.getByUserId(user_id);
    expect(created).toBeDefined();
  });

  test(".update()", async () => {
    await service.update(user_id, data);
    const { apiKey, siteId, dataTypes } = await service.getByUserId(user_id);
    const updated = { apiKey, siteId, dataTypes };
    expect(updated).toEqual(data);
    expect(updated).toBeDefined();
  });

  test(".delete()", async () => {
    await service.delete(user_id);
    const deletedRecord = await service.getByUserId(user_id);
    expect(deletedRecord).toBeNull();
  });
});
