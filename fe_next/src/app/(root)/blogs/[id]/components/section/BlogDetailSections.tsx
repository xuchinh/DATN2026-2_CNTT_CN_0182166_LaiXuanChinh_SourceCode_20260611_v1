
import BannerImage from "@/components/main-layout/sections/banner/BannerImage";
import type { Blog } from "../../../types/blog";
import DetailSection from "./blog-detail/DetailSection";
import BannerContents from "@/components/main-layout/sections/banner/BannerContent";
import RelatedPosts from "./RelatedPosts";

type DetailSectionProp = {
  blog: Blog;
};

const BlogDetailSections = ({ blog }: DetailSectionProp) => {
  return (
    <div>
      <BannerImage />
      <BannerContents
        heading={blog.title}
        headingClassName="max-w-[1032px]"
        sizeBannerClassName="lg:pb-0 md:max-h-none"
        supHeadingClassName="hidden h-0"
        descriptionClassName="hidden h-0"
      />
      <DetailSection blog={blog} />
      <RelatedPosts currentPostId={blog._id} />
    </div>
  );
};
export default BlogDetailSections;
