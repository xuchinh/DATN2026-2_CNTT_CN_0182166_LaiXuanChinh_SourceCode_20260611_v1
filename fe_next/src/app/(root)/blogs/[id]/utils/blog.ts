import type { Blog, RawBlog } from "../../types/blog";

export const convertRawBlog = (rawBlog: RawBlog) => {
  if (!rawBlog) return undefined;
  return {
    ...rawBlog?.attributes,
  } as Blog;
};
