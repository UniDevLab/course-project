// fetchTool.test.js
import { readFile } from "../tools/reader.tool";
import { FetchTool } from "../../src/tools/fetch.tool";
import { CustomError } from "../../src/constructors/error.constructor";
import { AxiosError, AxiosResponse } from "axios";
import { describe, expect, beforeEach, it } from "@jest/globals";

describe("FetchTool", () => {
  let fetchTool: FetchTool;

  const pathToFile = "tests/mocks/fetchTool.json";
  const { API_URL } = readFile(pathToFile);
  const responseCb = (response: AxiosResponse) => response.status;
  const errorCb = (_err: AxiosError) => new CustomError("Fetch", "Error", 404);

  beforeEach(() => {
    fetchTool = new FetchTool(API_URL);
  });

  describe("constructor", () => {
    it("should create an instance of FetchTool with a base URL", () => {
      expect(fetchTool.tool.defaults.baseURL).toBe(API_URL);
    });

    it("should create an instance of FetchTool without a base URL", () => {
      const toolWithoutBaseURL = new FetchTool();
      expect(toolWithoutBaseURL.tool.defaults.baseURL).toBeUndefined();
    });
  });

  describe("formRoute method", () => {
    it("should concatenate paths into a route string", () => {
      const route = fetchTool.formRoute("users", 123, "profile");
      expect(route).toBe("/users/123/profile");
    });
  });

  describe("handler method", () => {
    it("should handle a successful response", async () => {
      const result = await fetchTool.handler(
        fetchTool.tool.get("/"),
        responseCb,
        errorCb
      );

      expect(result).toEqual(200);
    });

    it("should handle an error response", async () => {
      const result = await fetchTool.handler(
        fetchTool.tool.get("/test"),
        responseCb,
        errorCb
      );

      expect(result).toEqual(new CustomError("Fetch", "Error", 404));
    });
  });
});
