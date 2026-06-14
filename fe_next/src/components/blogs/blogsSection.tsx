import { handleBlogs } from "./requests/blog.requests";
import BlogsTable from "./table/blog.table";


interface BlogSectionProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const BlogSection = async ({ searchParams }: BlogSectionProps) => {
    const res = await handleBlogs();
    return (
        <BlogsTable
            blogs={res?.data?.results ?? []}
            meta={res?.data?.meta}
        />
    );
};

export default BlogSection;