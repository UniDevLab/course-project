import {
  Schema,
  TranslationMap,
} from "../types/external/messages/parser.message.types";

export const defaultSchema: Schema = {
  titleIPTC: "",
  kanalExport: false,
  dateigroeße: 0,
  schlagwoerter: "",
  ALTtext: "",
  land: "",
  link: "",
  gueltigkeit: {},
  schlagwoerterIPTC: "",
  dateityp: "",
  assetId: 0,
  veroeffentlichung: {},
  name: "none",
  ausgabekanal: "",
  nebenmarke: {},
  hauptmarke: {},
};

export const translationMap: TranslationMap = {
  titleIptc: "titleIPTC",
  channelExport: "kanalExport",
  size: "dateigroeße",
  keywords: "schlagwoerter",
  alt: "ALTtext",
  language: "land",
  link: "link",
  validFrom: "gueltigkeit.von",
  validTo: "gueltigkeit.bis",
  keywordsIptc: "schlagwoerterIPTC",
  dataType: "dateityp",
  assetId: "assetId",
  publishFrom: "veroeffentlichung.von",
  publishTo: "veroeffentlichung.bis",
  filename: "name",
  outputChannel: "ausgabekanal",
  subBrand: "nebenmarke.name",
  mainBrand: "hauptmarke.name",
};
