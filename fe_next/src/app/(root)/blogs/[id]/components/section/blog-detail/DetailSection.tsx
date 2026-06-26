import "@/app/(root)/blogs/[id]/styles/custom-markdown.css";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import ImgFallback from "@/components/shared/ImgFallback";

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
            {blog.mainImage && (
              <div className="relative mb-[50px] pb-[56.25%]">
                <ImageWithFallback
                  src={encodeURI(blog.mainImage)}
                  alt="thumbnail"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex flex-col items-start gap-4 leading-relaxed">
              <p className="text-[18px] text-[#313A5A] font-normal leading-[28.8px]">
                {blog.introduce}
              </p>

              {blog.buildingId && (
                <div className="w-full rounded-[14px] border border-[#A7F3D0] bg-[#ECFDF5] p-5">
                  <p className="mb-3 font-playfair text-[20px] font-bold text-[#064E3B]">Thông tin nhà trọ</p>
                  <div className="flex flex-col gap-2 text-[16px] text-[#374151]">
                    <p><span className="font-semibold text-[#047857]">Tên nhà: </span>{buildingName}</p>
                    <p><span className="font-semibold text-[#047857]">Địa chỉ: </span>{buildingAddress}</p>
                    <p><span className="font-semibold text-[#047857]">Tổng số phòng: </span>{totalRooms} phòng</p>
                    <p><span className="font-semibold text-[#047857]">Giá trung bình mỗi phòng: </span>{priceOfRoom} VND/phòng</p>
                  </div>
                  <Link
                    href={`/accommodation?buildingId=${blog.buildingId}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#059669] px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(5,150,105,0.28)] transition hover:shadow-[0_6px_16px_rgba(5,150,105,0.38)]"
                  >
                    Xem chi tiết &amp; thuê phòng
                  </Link>
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
                    <ImgFallback
                      src={section.image}
                      alt={`Ảnh ${idx + 1}`}
                      className="w-[60%] max-h-[300px] object-cover rounded-lg shadow-md mx-auto"
                      hideOnError
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
