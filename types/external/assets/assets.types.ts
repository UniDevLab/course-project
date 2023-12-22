import { Schema } from "../messages/parser.message.types";

export type Asset = {
  titleIptc: keyof Schema;
  channelExport: keyof Schema;
  size: keyof Schema;
  keywords: keyof Schema;
  alt: keyof Schema;
  language: keyof Schema;
  link: keyof Schema;
  validFrom: string;
  validTo: string;
  keywordsIptc: keyof Schema;
  dataType: keyof Schema;
  assetId: keyof Schema;
  publishFrom: string;
  publishTo: string;
  filename: keyof Schema;
  outputChannel: keyof Schema;
  subBrand: string;
  mainBrand: string;
};

export type AssetRecord = Asset & {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
};
