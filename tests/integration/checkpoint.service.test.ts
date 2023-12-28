import { readFile } from "../tools/reader.tool";
import { createUser, deleteUser } from "../tools/user.tool";
import {
  closeDBConnection,
  connectDB,
} from "../../src/database/database.connection";
import { describe, expect, beforeAll, afterAll, test } from "@jest/globals";
import { CheckpointService } from "../../src/services/checkpoint.service";

let user_id: string;
let service: CheckpointService;

const pathToFile = "tests/mocks/checkpointService.json";
const { env, account } = readFile(pathToFile);

beforeAll(async () => {
  process.env = env;
  await connectDB();
  service = new CheckpointService();
  user_id = await createUser(account);
});

afterAll(async () => {
  await deleteUser(user_id);
  await closeDBConnection();
});

describe("CheckpointService Integration Tests", () => {
  test(".setState() and .getState()", async () => {
    await service.setState(user_id);
    const state = await service.getState(user_id);
    expect(state).toBe(true);
  });

  test(".delete()", async () => {
    await service.delete(user_id);
    const deletedRecord = await service.getState(user_id);
    expect(deletedRecord).toBeUndefined();
  });
});
