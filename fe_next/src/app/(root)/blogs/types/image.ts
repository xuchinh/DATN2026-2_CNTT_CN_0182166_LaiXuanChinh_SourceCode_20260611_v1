export type TypeImageFragment = {
  width: number;
  height: number;
  url: string;
  provider: string;
};
export type TypeImageConnector = {
  attributes: TypeImageFragment;
};
export type TypeImage = {
  data?: TypeImageConnector;
};
