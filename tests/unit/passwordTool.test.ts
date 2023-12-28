// passwordTool.test.js
import { readFile } from "../tools/reader.tool";
import { PasswordTool } from "../../src/tools/password.tool";
import { describe, expect, it, beforeEach } from "@jest/globals";

const pathToFile = "tests/mocks/passwordTool.json";
const { password, wrongPassword, env } = readFile(pathToFile);

describe("PasswordTool", () => {
  let passwordTool: PasswordTool;

  beforeEach(() => {
    process.env = env;
    passwordTool = new PasswordTool();
  });

  describe("hash method", () => {
    it("should hash a password", () => {
      const hashedPassword = passwordTool.hash(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });
  });

  describe("compare method", () => {
    it("should return true for matching password and hash", () => {
      const hashedPassword = passwordTool.hash(password);
      const result = passwordTool.compare(password, hashedPassword);
      expect(result).toBeTruthy();
    });

    it("should return false for mismatched password and hash", () => {
      const hashedPassword = passwordTool.hash(password);
      const result = passwordTool.compare(wrongPassword, hashedPassword);
      expect(result).toBeFalsy();
    });
  });
});
