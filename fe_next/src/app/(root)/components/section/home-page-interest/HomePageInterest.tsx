import InterestList from "@/app/(root)/components/section/home-page-interest/InterestList";

const HomePageInterest = () => {
  return (
    <section className="bg-gradient-to-b from-[#ECFDF5] to-[#F6FBF8] py-20 lg:py-28">
      <div className="mx-auto w-11/12 max-w-[1200px]">
        <div className="mx-auto max-w-[680px] text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#059669]">
            Lợi ích
          </span>
          <h2 className="mt-4 font-playfair text-[34px] font-bold leading-tight text-[#064E3B] md:text-[46px]">
            Nhẹ đầu hơn, làm chủ
            <span className="italic text-[#059669]"> mọi con số</span>
          </h2>
        </div>

        <div className="mt-14">
          <InterestList />
        </div>
      </div>
    </section>
  );
};

export default HomePageInterest;
