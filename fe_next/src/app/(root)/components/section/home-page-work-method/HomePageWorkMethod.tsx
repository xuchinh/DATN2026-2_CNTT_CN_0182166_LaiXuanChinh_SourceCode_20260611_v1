import StepList from "@/app/(root)/components/section/home-page-work-method/StepList";
import SpiralSVG from "@/app/(root)/components/svgs/SpiralSVG";

const HomePageWorkMethod = () => {
  return (
    <div className="h-[1050px] bg-gradient-to-b from-[#2D1B69] via-[#4C1D95] to-[#3B0764]">
      {/* text and cicle */}
      <div className="flex justify-center pt-[80px] ">
        <div className="w-[667px]  h-[300px]  overflow-hidden">
          <div className="w-[667px]  h-[667px] border-[3px] border-[#F97316] rounded-full">
            <div className=" w-[85%] mx-auto h-[250px] overflow-hidden mt-[50px] ">
              <div className="w-full h-[567px] bg-[#F3E8FF] rounded-full text-center pt-[73px] mx-auto ">
                <div className="flex justify-center mb-[25px]">
                  <SpiralSVG />
                </div>
                <h1 className="text-[#4C1D95] font-playfair text-[50px] font-medium capitalize ">
                  cách thức{" "}
                  <span className="text-[#F97316] font-playfair">hoạt động</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* step list */}
      <StepList />
    </div>
  );
};

export default HomePageWorkMethod;
