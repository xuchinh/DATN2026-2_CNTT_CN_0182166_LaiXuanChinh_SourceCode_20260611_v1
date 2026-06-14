import type { TypeImage } from "../image";
import type { TypePageData, TypePagination } from "../page-options";
import type { TypeUser } from "../user";
import type { Tags } from "./tags";

type Author = TypeUser;
export interface BlogContent {
  index?: string;
  Content1?: string;
  image?: string;
  Content2?: string;
}
export type Blog = {
  _id: string;
  title: string;
  mainImage: string;
  introduce: string
  Content: BlogContent[];
  conclusion: string;
  userId: string;
  buildingId: string;
  rating: string;
  createdAt: Date;
  updatedAt: Date;
  buildingName?: string;
  buildingAddress?: string;
  buildingPrice?: string;
};

export type RawBlog = {
  id: string | number;
  attributes: Blog;
};

export type BlogsMeta = TypePageData<Blog>;

// blog detail api
export type GetBlogDetailRequest = {
  id: string;
};
export type GetBlogDetailResponse = {
  data: RawBlog;
};

// query blogs by code api
export type QueryBlogsByIdRequest = {
  id?: string;
};
export type QueryBlogsByIdResponse = {
  meta: {
    pagination: TypePagination;
  };
  data: RawBlog[];
};

// query blogs
export type QueryBlogsResponse = {
  meta: {
    pagination: TypePagination;
  };
  data: RawBlog[];
};
