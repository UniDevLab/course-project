export type Entity = {
  name: string;
  link: string;
};

export type EntityPage = {
  result: any[];
  offset: number;
  limit: number;
  count: number;
  "total-count": number;
  page: {
    current: string;
    last: string;
    first: string;
  };
};

export type ListOfEntities = {
  [key: string]: Entity;
};

export type Notification = {
  ids: number[];
  subscription: {
    filter: string;
    name: string;
    url: string;
    key: string;
  };
};

export type Asset = any;

export type FilterCondition = (asset: Asset) => boolean;
