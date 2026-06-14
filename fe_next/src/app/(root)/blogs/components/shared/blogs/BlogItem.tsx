import Image from "next/image";
import Link from "next/link";

import type { Blog } from "../../../types/blog";
import SVGArrowRight from "../../svgs/SVGArrowRight";
import SVGCalendarBlank from "../../svgs/SVGCalendarBlank";
import SVGNotebook from "../../svgs/SVGNotebook";

type BlogItemProp = {
  blogs: Blog;
};

const BlogItem = ({ blogs }: BlogItemProp) => {
  return (
    <li className="aspect-[398/633] rounded-[14px] flex flex-col items-center gap-8 lg:w-[398px] w-[320px] p-3 lg:p-[18px] bg-white transition-all duration-300 cursor-pointer group hover:rounded-[14px] border-[2px] border-white hover:border-[#EEB537] hover:bg-[#FFF] hover:shadow-[0px_-6px_64px_0px_rgba(0,_0,_0,_0.15)] mx-auto">
      <Link
        href={`/blogs/${blogs._id}`}
        className="relative items-center gap-x-4 bg-white"
      >
        <div className="relative h-1/2 aspect-[360/312] lg:w-[360px] w-[296px] rounded-[6px]">
          <Image
            src={`${blogs.mainImage}`}
            fill
            alt="template thumbnail"
            className="rounded-t-md object-cover rounded-[6px]"
          />
        </div>
        <div className="py-8 transition-colors w-[296px] lg:w-[360px]">
          <p className="text-[14px] text-description font-normal leading-5 pb-3 flex gap-2 items-center">
            <SVGCalendarBlank />
            {new Date(blogs.createdAt).toLocaleDateString("vi-VN")}
            <SVGNotebook />
            {"5 Phút đọc"}
          </p>
          <p className="line-clamp-2 text-[18px] lg:text-[20px] text-description font-semibold leading-7 mb-4">
            {blogs.title}
          </p>
          <p className="text-[14px] text-description font-normal leading-5 mb-6 line-clamp-3">
            {blogs.introduce}
          </p>
          {/* {blogs.buildingAddress && (
            <p className="text-[14px] text-description font-normal leading-5 mb-1 line-clamp-2">
              {blogs.buildingAddress}
            </p>
          )} */}

          {/* {blogs.buildingPrice && (
            <p className="text-[14px] text-[#F97316] font-semibold leading-5 mb-4">
              {Number(blogs.buildingPrice).toLocaleString("vi-VN")} VNĐ/tháng
            </p>
          )} */}
          <div className="lg:w-[161px] lg:h-[56px] w-[140px] h-[46px] flex items-center justify-center rounded-lg border-[2px] border-[#9199A6] transition-colors duration-300 group-hover:border-[#EEB537] group-hover:text-[#EEB537]">
            <p className="flex items-center font-sora text-[14px] font-semibold leading-[56px] text-left">
              {"Đọc thêm"} <SVGArrowRight className="ml-2" />
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default BlogItem;
