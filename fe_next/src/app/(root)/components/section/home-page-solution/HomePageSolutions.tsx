import Image from "next/image";

import ActionButton from "@/components/shared/ActionButton";

const HomePageSolutions = () => {
  return (
    <div className="h-[893px] bg-[#FAF5FF] -mt-[7%]">
      {/* content */}
      <div className="max-w-[1220px] mx-auto flex justify-between items-center">
        {/* LEFT: text (flipped — was originally on right) */}
        <div className="max-w-[530px] pt-[240px]">
          {/* heading */}
          <div className="mb-5 max-w-[530px]">
            <h1 className="text-[#F97316] font-playfair text-[50px] italic font-medium ">
              Giải Pháp Tối Ưu
              <span className="text-[#4C1D95] not-italic font-playfair">
                {" "}
                Cho Các Chủ Nhà Trọ
              </span>
            </h1>
          </div>
          {/* promotion */}
          <div className="mb-11">
            <p className="text-[#4C1D95] font-sans text-xl font-normal leading-[150%] max-w-[440px]">
              Chào mừng bạn đến với RoomHub, nơi cung cấp phần mềm quản lý
              phòng trọ và nhà cho thuê hàng đầu. Với giải pháp toàn diện của
              chúng tôi, việc quản lý nhà trọ chưa bao giờ dễ dàng và hiệu quả
              đến thế.
            </p>
          </div>
          {/* action button */}
          <div>
            <ActionButton
              href="/pricing"
              className="text-center text-lg px-8 py-4 bg-[#F97316] border-[#F97316] hover:bg-[#EA6C0A] hover:border-[#EA6C0A]"
            >
              Xem chi tiết
            </ActionButton>
          </div>
        </div>

        {/* RIGHT: image (flipped — was originally on left) */}
        <div className="max-w-[620px] pt-[169px]">
          <Image
            src="/images/home-page/chart.png"
            width={550}
            height={550}
            alt="dashboard picture"
            className="w-[184%] max-w-none -translate-x-[10%]"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePageSolutions;
