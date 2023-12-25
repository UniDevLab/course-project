// parserTool.test.js
import { ParserTool } from "../../src/tools/parser.tool";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { readFile } from "../tools/reader.tool";
import { Asset } from "../../src/types/external/assets/assets.types";

const { assets, results } = readFile("tests/data/parser.json");

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
