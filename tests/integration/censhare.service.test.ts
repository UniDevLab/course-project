import { readFile } from "../tools/reader.tool";
import { CenshareService } from "../../src/services/censhare.service";
import {
  closeDBConnection,
  connectDB,
} from "../../src/database/database.connection";
import { describe, expect, beforeAll, afterAll, test } from "@jest/globals";
import { createUser, deleteUser } from "../tools/user.tool";

let user_id: string;
let service: CenshareService;

const pathToFile = "tests/mocks/censhareService.json";
const { data, listOfEntities, env, account } = readFile(pathToFile);

describe("CenshareService Integration Tests", () => {
  beforeAll(async () => {
    process.env = env;
    await connectDB();
    service = new CenshareService();
    user_id = await createUser(account);
  });

  afterAll(async () => {
    await deleteUser(user_id);
    await closeDBConnection();
  });

  test(".getByUserId()", async () => {
    const created = await service.getByUserId(user_id);
    expect(created).toBeDefined();

    await service.update(user_id, data);
    const updated = await service.getByUserId(user_id);
    const { censhareUsername, censharePassword } = updated;
    expect({ censharePassword, censhareUsername }).toEqual(data);
    expect(updated).toBeDefined();
  });

  test(".update()", async () => {
    await service.update(user_id, data);
    const updated = await service.getByUserId(user_id);
    const { censhareUsername, censharePassword } = updated;
    expect({ censharePassword, censhareUsername }).toEqual(data);
    expect(updated).toBeDefined();
  });

  test(".getListOfEntities()", async () => {
    const entities = await service.getListOfEntities(user_id);
    expect(entities).toBeDefined();
    expect(entities).toEqual(listOfEntities);
  });

  test(".delete()", async () => {
    await service.delete(user_id);
    const deletedRecord = await service.getByUserId(user_id);
    expect(deletedRecord).toBeNull();
  });
});
