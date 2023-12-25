import { Asset } from "../types/external/assets/assets.types";
import { defaultSchema, translationMap } from "../consts/parser.consts";
import {
  Schema,
  ProcessedFields,
} from "../types/external/messages/parser.message.types";

export class ParserTool {
  private schema: Schema = defaultSchema;
  private translation: Asset = translationMap;
  private processedFields: ProcessedFields = {};

  constructor() {}

  parse(asset: any): Schema {
    const result: any = {};
    this.search(asset, result);
    const parsed: Schema = { ...this.schema, ...result };
    const translated: Schema = this.translateAndTransform(parsed);
    return translated;
  }

  private search(asset: any, result: any = {}, parentKey: any = null) {
    const fieldsToFind = Object.keys(this.schema);

    for (const [key, value] of Object.entries(asset)) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        fieldsToFind.includes(currentKey) &&
        !this.processedFields[currentKey]
      ) {
        result[currentKey] = value;
        this.processedFields[currentKey] = true;
      } else if (fieldsToFind.includes(key) && !this.processedFields[key]) {
        result[key] = value;
        this.processedFields[key] = true;
      }

      const isProcessed = parentKey
        ? this.processedFields[`${parentKey}.${key}`]
        : this.processedFields[key];

      if (typeof value === "object" && value !== null && !isProcessed) {
        this.search(value, result, currentKey);
      }
    }

    this.setProcessedFields();
  }

  private setProcessedFields() {
    this.processedFields = {};
  }

  private translateField(
    data: any,
    field: string,
    defaultValue: any = undefined
  ) {
    const keys = field.split(".");
    let value = data;

    for (const key of keys) {
      if (value && key in value) {
        value = value[key];
        continue;
      }

      return defaultValue;
    }

    return value;
  }

  private translateAndTransform(data: any): Schema {
    const transformedObj: any = {};
    const entries = Object.entries(this.translation);

    for (const [englishField, germanField] of entries) {
      const value = this.translateField(data, germanField);

      if (value !== undefined) {
        transformedObj[englishField] = value;
      }
    }

    return transformedObj;
  }
}
