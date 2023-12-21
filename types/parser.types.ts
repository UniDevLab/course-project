export type Schema = {
  titleIPTC: string;
  kanalExport: boolean;
  dateigroeße: number;
  schlagwoerter: string;
  ALTtext: string;
  land: string;
  link: string;
  gueltigkeit: {
    von?: string;
    bis?: string;
  };
  schlagwoerterIPTC: string;
  dateityp: string;
  assetId: number;
  veroeffentlichung: {
    von?: string;
    bis?: string;
  };
  name: string;
  ausgabekanal: string;
  nebenmarke: {
    name?: string;
  };
  hauptmarke: {
    name?: string;
  };
};

export type TranslationMap = {
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

export type ProcessedFields = {
  [key: string]: boolean;
};
