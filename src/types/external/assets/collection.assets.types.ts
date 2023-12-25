import { Asset, AssetRecord } from "./assets.types";

export type Failure = {
  asset: Asset;
  message: string;
};

export type DataItem = {
  _id: string;
  data: AssetRecord;
};

export type DataItemResponse = {
  dataItem: DataItem;
};

export type CollectionMapping = {
  [key: string]: string;
};
