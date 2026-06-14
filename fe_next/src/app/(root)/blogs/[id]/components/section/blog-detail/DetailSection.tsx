import "@/app/(root)/blogs/[id]/styles/custom-markdown.css";

import Image from "next/image";

import type { Blog, BlogContent } from "../../../../types/blog";
import UiFadeAnimateDiv from "../../../ui/UiAnimate/UiFadeAnimateDiv";
import BottomShareBar from "./BottomShareBar";
import { handleBuilding, handleUser } from "@/components/blogs/requests/blog.requests";
import Link from "next/link";

const DetailSection = async ({ blog }: { blog: Blog }) => {
  const resUser = await handleUser();
  const userOptions = resUser?.data?.results ?? [];
  const resBuilding = await handleBuilding();
  const buildingOptions = resBuilding?.data?.results ?? [];
  const selectedUser = userOptions.find((us: any) => us._id === blog?.userId);
  const userName = selectedUser?.name || 'Không xác định';
  const selectedBuilding = buildingOptions.find((bd: any) => bd._id === blog?.buildingId);
  const buildingName = selectedBuilding?.name || 'Không xác định';
  const buildingAddress = selectedBuilding?.address || 'Không xác định';
  const priceOfRoom = selectedBuilding?.priceOfRoom || 'Không xác định';
  const totalRooms = selectedBuilding?.totalRooms || 'Không xác định';

  return (
    <section className="bg-[#f5f5f7] py-10">
      <UiFadeAnimateDiv className="mx-auto max-w-[1240px] px-5 bg-white rounded-[20px] relative z-[2]">
        <div className="mx-auto max-w-[1086.86px] py-12 w-[100%]">
          <div className="mb-5">
            <div className="relative mb-[50px] pb-[56.25%]">
              <Image
                src={encodeURI(blog.mainImage || "")}
                alt="thumbnail"
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-4 leading-relaxed">
              <p className="text-[18px] text-[#313A5A] font-normal leading-[28.8px]">
                {blog.introduce}
              </p>

              {blog.buildingId && (
                <div className="flex flex-col gap-2">
                  <p className="text-[18px] text-[#313A5A]">
                    <span className="font-bold ml-5">Tên nhà: </span><span>{buildingName}</span>
                  </p>
                  <p className="text-[18px] text-[#313A5A]">
                    <span className="font-bold ml-5">Địa chỉ: </span><span>{buildingAddress}</span>
                  </p>
                  <p className="text-[18px] text-[#313A5A]">
                    <span className="font-bold ml-5">Tổng số phòng: </span><span>{totalRooms}</span> phòng
                  </p>
                  <p className="text-[18px] text-[#313A5A]">
                    <span className="font-bold ml-5">Giá trung bình mỗi phòng: </span><span>{priceOfRoom}</span> VND/phòng
                  </p>
                  <p className="text-[18px] text-[#313A5A]">
                    <span className="font-bold ml-5"> Xem chi tiết và thuê phòng </span><span className="hover:text-blue-600 "><Link href={`/accommodation?buildingId=${blog.buildingId}`} className="hover:underline hover:text-blue-600">
                      ( tại đây )
                    </Link></span>
                  </p>
                </div>
              )}
              {(blog.Content || []).map((section: BlogContent, idx: number) => (
                <div key={idx} className=" flex flex-col gap-4 my-4 ">
                  {section.index && (
                    <p className="text-2xl font-bold">{section.index}</p>
                  )}
                  {section.Content1 && (
                    <p className="text-[18px] text-[#313A5A] font-normal leading-[28.8px]">{section.Content1}</p>
                  )}
                  {section.image && (
                    <img
                      src={section.image}
                      alt={`Ảnh ${idx + 1}`}
                      className="w-[60%] max-h-[300px] object-cover rounded-lg shadow-md mx-auto"
                    />
                  )}
                  {section.Content2 && (
                    <p className="text-[18px] text-[#313A5A] font-normal leading-[28.8px]">{section.Content2}</p>
                  )}
                </div>
              ))}
              {blog.conclusion && (
                <p className="lg:text-[18px] text-[#313A5A]">{blog.conclusion}</p>
              )}
            </div>
          </div>
          <BottomShareBar
            id={blog._id}
            title={blog.title}
            dateShare={
              blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString('vi-VN') : ''
            }
            authorName={userName}
          />
        </div>
      </UiFadeAnimateDiv>
    </section>
  );
};
export default DetailSection;
