import BannerImage from "@/components/main-layout/sections/banner/BannerImage";
import BlogSectionList from "./blog-section-list/BlogsSectionsList";
import BannerContents from "@/components/main-layout/sections/banner/BannerContent";
type BlogsSectionsProps = { tag?: string[] };
const BlogsSections = (props: BlogsSectionsProps) => {
  return (
    <div className="bg-[#f5f5f7] relative">
      <BannerImage />
      <BannerContents
        heading="Blog"
        description="Chúng tôi cung cấp nhiều gói dịch vụ với mức giá linh hoạt, phù hợp với nhu cầu và quy mô kinh doanh của bạn. Hãy chọn gói phù hợp nhất và bắt đầu trải nghiệm sự tiện lợi và hiệu quả từ phần mềm của chúng tôi."
      />
      <BlogSectionList props={props} />
    </div>
  );
};
export default BlogsSections;
