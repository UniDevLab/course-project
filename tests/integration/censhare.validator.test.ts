// censhareValidator.test.js
import { readFile } from "../tools/reader.tool";
import { CustomError } from "../../src/constructors/error.constructor";
import { CenshareValidator } from "../../src/validation/validators/censhare.validator";
import { describe, expect, beforeEach, test } from "@jest/globals";

describe("CenshareValidator", () => {
  let validator: CenshareValidator;

  const pathToFile = "tests/mocks/censhareValidator.json";
  const { env, auth, wrongAuth } = readFile(pathToFile);

  beforeEach(() => {
    process.env = env;
    validator = new CenshareValidator();
  });

  test("checkCredentials - successful validation", async () => {
    const { username, password } = auth;

    const result = await validator.checkCredentials(username, password);

    expect(result).toBe(true);
  });

  test("checkCredentials - invalid credentials", async () => {
    const { username, password } = wrongAuth;
    const error = new CustomError("Censhare Auth", "Invalid credentials!", 401);
    await expect(
      validator.checkCredentials(username, password)
    ).rejects.toThrowError(error);
  });
});
