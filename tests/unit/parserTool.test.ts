// parserTool.test.js
import { ParserTool } from "../../src/tools/parser.tool";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { readFile } from "../tools/reader.tool";
import { Asset } from "../../src/types/external/assets/assets.types";

const pathToFile = "tests/mocks/parserTool.json";
const { assets, results } = readFile(pathToFile);

describe("ParserTool", () => {
  let parserTool: ParserTool;

  beforeEach(() => {
    parserTool = new ParserTool();
  });

  test("parse method should return translated schema", () => {
    const parsed = assets.map((asset: Asset) => parserTool.parse(asset));

    expect(parsed).toEqual(results);
  });
});
