export type TypeUserFragment = {
  email: string;
  nickname: string;
};

export type TypeUserConnector = {
  attributes: TypeUserFragment;
};

export type TypeUser = {
  data: TypeUserConnector;
};
