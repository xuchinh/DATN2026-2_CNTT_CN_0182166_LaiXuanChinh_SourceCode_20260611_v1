
import type { Blog } from "../../../types/blog";
import DetailSection from "./blog-detail/DetailSection";
import RelatedPosts from "./RelatedPosts";
import PageBanner from "@/components/main-layout/sections/banner/PageBanner";

type DetailSectionProp = {
  blog: Blog;
};

const BlogDetailSections = ({ blog }: DetailSectionProp) => {
  return (
    <div>
      <PageBanner title={blog.title} titleClassName="max-w-[900px] mx-auto" />
      <DetailSection blog={blog} />
      <RelatedPosts currentPostId={blog._id} />
    </div>
  );
};
export default BlogDetailSections;
