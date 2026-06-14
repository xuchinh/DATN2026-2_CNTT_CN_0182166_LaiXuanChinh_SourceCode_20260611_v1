import Image from "next/image";

import StarSVG from "@/app/(root)/components/svgs/StarSVG";
import ActionButton from "@/components/shared/ActionButton";

const HomePageIntro = () => {
  return (
    <div className="h-[952px] bg-[url('/images/home-page/background.png')] bg-cover bg-center relative z-50">
      {/* Deep purple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95]/90 via-[#5B21B6]/85 to-[#7C3AED]/70 z-[1]" />

      <div className="flex relative z-[2] h-full">
        {/* LEFT: dashboard image (flipped — was originally on right) */}
        <div className="w-1/2 overflow-hidden pt-[130px]">
          <div className="w-[984px] h-[637px]">
            <Image
              src="/images/home-page/dashboard.png"
              width={984}
              height={637}
              alt="dashboard picture"
            />
          </div>
        </div>

        {/* RIGHT: text content (flipped — was originally on left) */}
        <div className="pt-[252px] w-1/2 pl-12 pr-[6%]">
          <div className="max-w-[640px]">
            {/* heading */}
            <div className="mb-5">
              <h1 className="text-white font-playfair text-[64px] font-bold leading-[134%]">
                Phần mền quản lý
              </h1>
              <div className="flex space-x-12">
                <h1 className="text-[#F97316] font-playfair text-[64px] font-bold leading-[134%] italic">
                  Nhà Trọ Tối Ưu
                </h1>
                <StarSVG />
              </div>
            </div>
            {/* promotion */}
            <div className="mb-11">
              <p className="text-white font-sans text-[30px] font-normal leading-[143%] max-w-[528px]">
                Giải pháp quản lý nhà trọ toàn diện, hiệu quả và tiết kiệm thời
                gian.
              </p>
            </div>
            {/* action button */}
            <div>
              <ActionButton
                href="/pricing"
                className="mb-5 text-center text-lg px-8 py-4 hover:bg-[#F97316] hover:border-[#F97316]"
              >
                Đăng ký dùng thử miễn phí
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageIntro;
