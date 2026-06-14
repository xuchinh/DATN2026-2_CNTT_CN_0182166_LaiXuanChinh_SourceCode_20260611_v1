
import BlogSection from "@/components/blogs/blogsSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý bài viết",
    description:
        "Quản lý bài viết giúp superadmin có thể quản lý các tài khoản mà khách hàng đã dùng",
    keywords:
        "Quản lý bài viết phần mềm quản lý bài viết",
    alternates: {
        canonical: `http://localhost:3000/dashboard/blogs`,
    },
};
const BlogSectionPage = async (props: IProps) => {

    return (
        <div>
            < BlogSection searchParams={props.searchParams}></BlogSection>
        </div >
    )
}

export default BlogSectionPage;