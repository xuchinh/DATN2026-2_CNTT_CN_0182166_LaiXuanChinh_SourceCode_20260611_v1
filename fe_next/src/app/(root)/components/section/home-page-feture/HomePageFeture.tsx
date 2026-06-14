import Image from "next/image";

import FeatureList from "@/app/(root)/components/section/home-page-feture/FeatureList";
import StarSVG from "@/app/(root)/components/svgs/StarSVG";

const HomePageFeture = () => {
  return (
    <div className="h-[1190px]">
      {/* content */}
      <div className="ml-[3%]  flex gap-24 h-full ">
        {/* picture left side */}
        <div className="w-1/2 pt-[121px] ">
          <div className="max-w-[858px]">
            {/* heading */}
            <div className="flex items-center">
              <StarSVG className="mr-5 " />
              <h1 className="text-[#4C1D95] font-playfair text-[64px] font-medium ">
                Tính Năng
                <span className="text-[#F97316] italic font-playfair">
                  {" "}
                  Nổi Bật
                </span>
              </h1>
            </div>
            <div className="relative z-10">
              <Image
                src="/images/home-page/feture-chart.png"
                width={858}
                height={563}
                alt="future chart picture"
                className="object-cover bg-no-repeat"
              />
            </div>
            <div className="relative translate-x-[6%] translate-y-[-16%] z-0 ">
              <Image
                src="/images/home-page/dot-left-feture.png"
                width={347}
                height={282}
                alt="dot left"
                className="object-cover bg-no-repeat"
              />
            </div>
          </div>
        </div>
        <FeatureList className="w-1/2 bg-gradient-to-b from-[#4C1D95] to-[#3B0764] relative" />
      </div>
    </div>
  );
};

export default HomePageFeture;
