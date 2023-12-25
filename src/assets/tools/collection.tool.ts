import { ClientTool } from "./client.tool";
import { Asset, AssetRecord } from "../../types/external/assets/assets.types";
import {
  Failure,
  DataItemResponse,
  CollectionMapping,
} from "../../types/external/assets/collection.assets.types";

export class CollectionTool extends ClientTool {
  private readonly mapping: CollectionMapping = {
    image: "Image",
    audio: "Audio",
    application: "Document",
  };

  constructor() {
    super();
  }

  private getCollectionId(asset: Asset) {
    const types = Object.keys(this.mapping);
    const type = types.find((item) => asset.dataType.includes(item));
    return this.mapping[type] || this.mapping.application;
  }

  private getDifference(arrayOfData: Asset[], records: AssetRecord[]) {
    const result = [];

    for (const data of arrayOfData) {
      let hasMatch = false;

      for (const record of records) {
        if (data.assetId !== record.assetId) continue;

        hasMatch = true;
        break;
      }

      if (!hasMatch) result.push(data);
    }

    return result;
  }

  private getIntersection(arrayOfData: Asset[], records: AssetRecord[]) {
    const result = [];

    for (const data of arrayOfData) {
      for (const record of records) {
        if (data.assetId !== record.assetId) continue;

        const expanded = { _id: record._id, ...data };
        result.push(expanded);
        break;
      }
    }

    return result;
  }

  async getById(user_id: string, data: Asset) {
    const fieldName = "assetId";
    const dataCollectionId = this.getCollectionId(data);
    const options = { dataCollectionId, consistentRead: true };
    const { items } = await this.getClient(user_id);
    const result = await items
      .queryDataItems(options)
      .eq(fieldName, data.assetId)
      .find();
    const record = result.items[0];
    return record;
  }

  async processQueries(
    operation: string,
    assets: Asset[],
    queries: Promise<DataItemResponse>[]
  ) {
    const message = `Failed ${operation}`;
    const records = await Promise.all(queries);
    const filtered = records.filter((record) => !(record instanceof Error));
    const formatted = filtered.map((record) => record.dataItem.data);
    const difference = this.getDifference(assets, formatted);
    const failures = difference.map((asset) => ({ asset, message }));
    return failures;
  }

  async checkExistance(user_id: string, arrayOfData: Asset[]) {
    const queries = [];

    for (const data of arrayOfData) {
      const query = this.getById(user_id, data);
      queries.push(query);
    }

    const results = await Promise.all(queries);
    const records = results.map((item) => (item && item.data ? item.data : {}));
    const existing = this.getIntersection(arrayOfData, records);
    const nonExsiting = this.getDifference(arrayOfData, records);
    return { existing, nonExsiting };
  }

  async upload(user_id: string, arrayOfData: Asset[]) {
    const queries = [];

    for (const data of arrayOfData) {
      const dataCollectionId = this.getCollectionId(data);
      const options = { dataCollectionId, dataItem: { data } };
      const { items } = await this.getClient(user_id);
      const query = items.insertDataItem(options);
      queries.push(query);
    }

    const result = await this.processQueries("upload", arrayOfData, queries);
    return result;
  }

  async update(user_id: string, arrayOfData: AssetRecord[]) {
    const queries = [];

    for (const data of arrayOfData) {
      const dataCollectionId = this.getCollectionId(data);
      const options = { dataCollectionId, dataItem: { id: data._id, data } };
      const { items } = await this.getClient(user_id);
      const query = items.updateDataItem(data._id, options);
      queries.push(query);
    }

    const result = await this.processQueries("update", arrayOfData, queries);
    return result;
  }

  async delete(user_id: string, arrayOfData: AssetRecord[]) {
    const queries = [];

    for (const data of arrayOfData) {
      const dataCollectionId = this.getCollectionId(data);
      const options = { dataCollectionId };
      const { items } = await this.getClient(user_id);
      const query = items.removeDataItem(data._id, options);
      queries.push(query);
    }

    const result = await this.processQueries("delete", arrayOfData, queries);
    return result;
  }

  async error(user_id: string, arrayOfData: Array<Failure | Error>) {
    const queries = [];

    for (let data of arrayOfData) {
      const dataCollectionId = "Error";

      if (data instanceof Error) {
        const { message } = data;
        data = { asset: {} as Asset, message };
      }

      const options = { dataCollectionId, dataItem: { data } };
      const { items } = await this.getClient(user_id);
      const query = items.insertDataItem(options);
      queries.push(query);
    }

    await Promise.all(queries);
  }
}
