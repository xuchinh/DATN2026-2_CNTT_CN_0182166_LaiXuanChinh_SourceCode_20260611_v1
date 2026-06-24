import FeatureList from "@/app/(root)/components/section/home-page-feture/FeatureList";

const HomePageFeture = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Hình khối nghệ thuật nền */}
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#ECFDF5] blur-2xl" />
      <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#ECFDF5] blur-2xl" />

      <div className="relative z-10 mx-auto w-11/12 max-w-[1200px]">
        <div className="mx-auto max-w-[640px] text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#059669]">
            Tính năng nổi bật
          </span>
          <h2 className="mt-4 font-playfair text-[34px] font-bold leading-tight text-[#064E3B] md:text-[46px]">
            Đủ công cụ để bạn
            <span className="italic text-[#059669]"> vận hành trọn vẹn</span>
          </h2>
          <p className="mt-4 text-lg text-[#3F5C50]">
            Mọi thứ một chủ trọ cần, gói gọn trong một nền tảng dễ dùng.
          </p>
        </div>

        <div className="mt-14">
          <FeatureList />
        </div>
      </div>
    </section>
  );
};

export default HomePageFeture;
