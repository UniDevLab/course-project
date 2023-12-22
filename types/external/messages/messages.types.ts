export type Notification = {
  ids: number[];
  subscription: {
    filter: string;
    name: string;
    url: string;
    key: string;
  };
};
