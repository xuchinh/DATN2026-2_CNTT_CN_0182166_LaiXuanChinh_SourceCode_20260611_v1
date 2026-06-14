import type { Metadata } from "next";
import { redirect } from "next/navigation";


import { handleBlogsById } from "../requests/blog.request";
import type { Blog } from "../types/blog";
import BlogDetailSections from "./components/section/BlogDetailSections";

type BlogDetailPageProps = {
  params: {
    id: string;
  };
};
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { id } = params;
  let title = "Blog Detail";
  let description = "Blog Description";
  try {
    const response = await handleBlogsById(id);
    const blog = response?.data?.results?.[0] ? response?.data?.results?.[0] : undefined;
    if (blog) {
      title = blog.title;
      description = blog.introduce;
    }
  } catch (error) {
    console.log("Error while fetching blog detail at BlogDetailPage: ", error);
  }
  return {
    title,
    description,
    keywords:
      "Blog quản lý nhà trọ, Tin tức quản lý nhà trọ, Kinh nghiệm quản lý nhà trọ, Xu hướng quản lý tài sản cho thuê.",
    alternates: {
      canonical: `http://localhost:3000/blogs`,
    },
  };
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { id } = params;
  let blog: Blog | undefined;

  try {
    const response = await handleBlogsById(id);
    blog = response?.data?.results?.[0] ? response?.data?.results?.[0] : undefined;
  } catch (error) {
    console.error(
      "Error while fetching blog detail at BlogDetailPage: ",
      error,
    );
  }

  if (!blog) {
    return redirect("/404");
  }

  return <BlogDetailSections blog={blog} />;
};

export default BlogDetailPage;
