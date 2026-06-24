import Link from "next/link";
import ImageWithFallback from "@/components/shared/ImageWithFallback";

import type { Blog } from "../../../types/blog";
import SVGArrowRight from "../../svgs/SVGArrowRight";
import SVGCalendarBlank from "../../svgs/SVGCalendarBlank";
import SVGNotebook from "../../svgs/SVGNotebook";

type BlogItemProp = {
  blogs: Blog;
};

const BlogItem = ({ blogs }: BlogItemProp) => {
  return (
    <li className="group flex w-full flex-col rounded-[14px] border-[2px] border-[#E5E7EB] bg-white p-4 transition-all duration-300 hover:border-[#EEB537] hover:shadow-[0px_10px_40px_0px_rgba(0,0,0,0.10)]">
      <Link href={`/blogs/${blogs._id}`} className="block w-full">
        {/* Ảnh thumbnail co giãn theo thẻ */}
        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[8px]">
          <ImageWithFallback
            src={`${blogs.mainImage}`}
            fill
            alt="template thumbnail"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="w-full pt-4">
          <p className="flex items-center gap-2 pb-2 text-[13px] font-normal leading-5 text-description">
            <SVGCalendarBlank />
            {new Date(blogs.createdAt).toLocaleDateString("vi-VN")}
            <SVGNotebook />
            {"5 Phút đọc"}
          </p>
          <p className="mb-2 line-clamp-2 text-[17px] font-semibold leading-6 text-description">
            {blogs.title?.length > 133 ? blogs.title.slice(0, 133) + "..." : blogs.title}
          </p>
          <p className="mb-4 line-clamp-3 text-[14px] font-normal leading-5 text-description">
            {blogs.introduce}
          </p>
          <div className="flex h-[44px] w-[136px] items-center justify-center rounded-lg border-[2px] border-[#9199A6] transition-colors duration-300 group-hover:border-[#EEB537] group-hover:text-[#EEB537]">
            <p className="flex items-center font-sora text-[14px] font-semibold">
              {"Đọc thêm"} <SVGArrowRight className="ml-2" />
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default BlogItem;
