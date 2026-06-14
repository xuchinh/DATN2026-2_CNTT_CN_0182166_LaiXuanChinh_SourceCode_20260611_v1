
import { cn } from "@/components/main-layout/utils/classname";
import type { BlogsMeta } from "../../../types/blog";
import BlogItem from "./BlogItem";

type BlogListProps = BlogsMeta & {
  className?: string;
};

const BlogList = ({ data, className }: BlogListProps) => {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative ",
        className,
      )}
    >
      {data.map((item, index) => {
        return <BlogItem key={`blog-item-${index}`} blogs={item} />;
      })}
    </ul>
  );
};
export default BlogList;
