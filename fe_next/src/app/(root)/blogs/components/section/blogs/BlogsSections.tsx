import BlogSectionList from "./blog-section-list/BlogsSectionsList";
import PageBanner from "@/components/main-layout/sections/banner/PageBanner";
type BlogsSectionsProps = { tag?: string[] };
const BlogsSections = (props: BlogsSectionsProps) => {
  return (
    <div className="bg-[#f5f5f7] relative">
      <PageBanner />
      <BlogSectionList props={props} />
    </div>
  );
};
export default BlogsSections;
