// tokenTool.test.js
import { TokenTool } from "../../src/tools/token.tool";
import { describe, expect, beforeEach, it } from "@jest/globals";
import { readFile } from "../tools/reader.tool";

describe("ParserTool", () => {
  let tokenTool: TokenTool;
  const pathToFile = "tests/mocks/tokenTool.json";
  const { value, env } = readFile(pathToFile);

  beforeEach(() => {
    process.env = env;
    tokenTool = new TokenTool();
  });

  describe("decodeToken method", () => {
    it("should decode a valid access token", () => {
      const accessToken = tokenTool.getAccessToken(value);
      const decoded = tokenTool.decodeToken(accessToken);
      const result = typeof decoded === "string" ? {} : decoded;
      expect(decoded).toBeDefined();
      expect(result._id).toBe(value._id);
    });

    it("should decode a valid refresh token", () => {
      const refreshToken = tokenTool.getRefreshToken(value);
      const decoded = tokenTool.decodeToken(refreshToken);
      const result = typeof decoded === "string" ? {} : decoded;
      expect(decoded).toBeDefined();
      expect(result._id).toBe(value._id);
    });
  });

  describe("getWixAuthToken method", () => {
    it("should return a valid Wix auth token", () => {
      const wixAuthToken = tokenTool.getWixAuthToken(value, "secret");
      expect(wixAuthToken).toBeDefined();
      expect(wixAuthToken).toContain("Bearer");
    });
  });

  describe("getAccessToken method", () => {
    it("should return a valid access token", () => {
      const accessToken = tokenTool.getAccessToken(value);
      expect(accessToken).toBeDefined();
      expect(accessToken).toContain("Bearer");
    });
  });

  describe("getRefreshToken method", () => {
    it("should return a valid refresh token", () => {
      const refreshToken = tokenTool.getRefreshToken(value);
      expect(refreshToken).toBeDefined();
      expect(refreshToken).not.toContain("Bearer");
    });
  });

  describe("getTokens method", () => {
    it("should return valid access and refresh tokens", () => {
      const tokens = tokenTool.getTokens(value);
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.accessToken).toContain("Bearer");
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.refreshToken).not.toContain("Bearer");
    });
  });
});
