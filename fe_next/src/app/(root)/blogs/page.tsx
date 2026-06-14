import type { Metadata } from "next";

import BlogsSections from "./components/section/blogs/BlogsSections";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Cập nhật các tin tức, mẹo và xu hướng mới nhất trong ngành quản lý nhà trọ. Chia sẻ kinh nghiệm và chiến lược tối ưu hóa quản lý tài sản.",
  keywords:
    "Blog quản lý nhà trọ, Tin tức quản lý nhà trọ, Kinh nghiệm quản lý nhà trọ, Xu hướng quản lý tài sản cho thuê.",
  alternates: {
    canonical: `http://localhost:3000/blogs`,
  },
};

const BlogsPage = async (props: { searchParams: { tag?: string[] } }) => {
  return <BlogsSections tag={props.searchParams.tag} />;
};
export default BlogsPage;
