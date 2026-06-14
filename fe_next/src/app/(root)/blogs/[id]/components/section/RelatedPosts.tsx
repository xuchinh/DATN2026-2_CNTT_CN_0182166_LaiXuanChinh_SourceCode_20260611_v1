"use client";

import { useEffect, useState } from "react";

import BlogItem from "../../../components/shared/blogs/BlogItem";
import { handleBlogsById, handleBlogsByUser } from "../../../requests/blog.request";
import type { Blog } from "../../../types/blog";
import type { Tags } from "../../../types/blog/tags";
import type { TypePaginationRequest } from "../../../types/page-options";
import SVGVector from "../svgs/SVGVector";

type RelatedPostsProps = {
  currentPostId: string;
};

const RelatedPosts = ({ currentPostId }: RelatedPostsProps) => {
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [isInit, setIsInit] = useState(false);

  const fetchRelatedPosts = async () => {
    try {
      // Lấy thông tin blog hiện tại để biết userId
      const currentPostRes = await handleBlogsById(currentPostId);
      const currentPost: Blog | undefined = currentPostRes?.data?.results?.[0];

      if (!currentPost) {
        console.warn("Không tìm thấy bài viết hiện tại");
        setIsInit(true);
        return;
      }

      // Lấy danh sách blog cùng tác giả
      const blogsRes = await handleBlogsByUser(currentPost.userId);
      let blogs: Blog[] = blogsRes?.data?.results || [];

      // Lọc bỏ bài hiện tại
      blogs = blogs.filter((blog) => blog._id !== currentPostId);

      // Chọn 3 bài đầu tiên
      setRelatedPosts(blogs.slice(0, 3));
      setIsInit(true);
    } catch (error) {
      console.error("Lỗi khi lấy blog liên quan:", error);
      setIsInit(true);
    }
  };

  useEffect(() => {
    if (!isInit) {
      fetchRelatedPosts();
    }
  }, [isInit, currentPostId]);

  return (
    <section className="flex flex-col items-center pb-16 pt-12 bg-[#F5F5F7]">
      <h2 className="text-center font-playfair text-[48px] font-[600] leading-[56px] text-[#121314]">
        Blog liên quan
      </h2>
      <div className="relative mt-2 lg:mt-4 flex justify-center items-center">
        <SVGVector className="w-[138px] h-[32px]" />
      </div>
      {isInit ? (
        relatedPosts.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative lg:mt-[3.625rem] lg:w-full lg:max-w-[1273px]">
            {relatedPosts.map((blogs) => (
              <BlogItem key={blogs._id} blogs={blogs} />
            ))}
          </div>
        ) : (
          <div className="mt-1">
            <h2>Không có bài viết liên quan</h2>
          </div>
        )
      ) : (
        <div className="mt-1">
          <h2>Đang tải...</h2>
        </div>
      )}
    </section>
  );
};

export default RelatedPosts;
