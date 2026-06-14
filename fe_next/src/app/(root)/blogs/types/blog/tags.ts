import type { TypePagination } from "../page-options";

export type TagFragment = {
  label: string;
  value: string;
};
type TagConnector = {
  attributes: TagFragment;
};
export type Tags = {
  data: TagConnector[];
};

export type QueryBlogTagsResponse = {
  meta: {
    pagination: TypePagination;
  };
  data: TagConnector[];
};
