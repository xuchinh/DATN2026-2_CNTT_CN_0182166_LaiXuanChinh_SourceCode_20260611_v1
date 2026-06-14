"use client";

import { useEffect, useState } from "react";

import type { Blog } from "@/app/(root)/blogs/types/blog";
import type { TypePaginationRequest } from "../../../../types/page-options";
import { defaultMeta } from "../../../consts/default-data";
import BlogList from "../../../shared/blogs/BlogList";
import LoadMorePaginate from "./LoadMorePaginate";
import { handleBlogs } from "@/app/(root)/blogs/requests/blog.request";
import EmptyDataBlock from "../../../shared/errors/EmptyDataBlock";

type BlogSectionListProp = {
  props: { tag?: string[] };
};
const BlogSectionList = ({ props }: BlogSectionListProp) => {
  const [pagePointing, setPagePointing] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [meta, setMeta] = useState(defaultMeta);

  const fetchBlogs = async (current: number, reset = false) => {
    const paginationRequest: TypePaginationRequest = { current, pageSize: 3 };
    const resBlogs = await handleBlogs(
      paginationRequest,
    )
    console.log('check resBlogs', resBlogs);

    const displayedBlogs = resBlogs?.data?.results;
    props.tag || undefined,
      paginationRequest,
      setBlogs((prevBlogs) =>
        reset ? displayedBlogs : [...prevBlogs, ...displayedBlogs],
      );
    setMeta(resBlogs.data.meta);
  };

  useEffect(() => {
    setPagePointing(1);
    setBlogs([]);
    fetchBlogs(1, true);
  }, [props.tag]);

  const onLoadMore = () => {
    const nextPage = pagePointing + 1;
    if (nextPage > meta.pageCount) {
      return;
    }
    fetchBlogs(nextPage);
    setPagePointing(nextPage);
  };

  return (
    <section className="container mx-auto pb-12 flex items-center justify-center bg-[#f5f5f7] ">
      <div className="relative z-[2]">
        <BlogList data={blogs} meta={meta} className="items-center" />
        {blogs.length <= 0 ? (
          <div className="mt-5">
            <EmptyDataBlock />
          </div>
        ) : null}
        <LoadMorePaginate
          loadMoreTitle={"Tải thêm ..."}
          onLoadMore={onLoadMore}
        />
      </div>
    </section>
  );
};

export default BlogSectionList;
