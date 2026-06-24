import Link from "next/link";

const HomePageIntro = () => {
  return (
    <section className="relative flex min-h-[760px] items-center overflow-hidden bg-gradient-to-br from-[#047857] via-[#059669] to-[#10B981]">
      {/* Hình khối nghệ thuật thay cho ảnh */}
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -left-10 bottom-[-12%] h-[30rem] w-[30rem] rounded-full bg-white/10 blur-3xl" />
      <div className="absolute right-[18%] top-[26%] h-44 w-44 rounded-full border border-white/20" />
      <div className="absolute bottom-[22%] left-[16%] h-24 w-24 rotate-45 rounded-2xl bg-white/10" />
      <div className="absolute right-[12%] bottom-[24%] h-12 w-12 rounded-full bg-[#D1FAE5]/40" />

      <div className="relative z-10 mx-auto w-11/12 max-w-[1200px] pb-24 pt-[150px] text-center">
        <span className="inline-block rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white backdrop-blur">
          ✦ Giải pháp quản lý nhà trọ toàn diện
        </span>
        <h1 className="mt-6 font-playfair text-[44px] font-bold leading-tight text-white md:text-[64px]">
          Cho thuê trọ gọn gàng,
          <br />
          <span className="italic text-[#D1FAE5]">thu tiền nhẹ tênh</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[640px] text-lg leading-relaxed text-white/90 md:text-xl">
          RoomHub giúp bạn quản lý phòng, hóa đơn và khách thuê chỉ trong vài cú nhấp —
          minh bạch, nhanh chóng, ở bất cứ đâu.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/pricing"
            className="rounded-full bg-white px-8 py-4 text-[16px] font-semibold text-[#047857] shadow-lg transition-all duration-200 hover:scale-[1.03]"
          >
            Dùng thử miễn phí
          </Link>
          <Link
            href="/accommodation"
            className="rounded-full border border-white/60 px-8 py-4 text-[16px] font-semibold text-white transition-all duration-200 hover:bg-white/10"
          >
            Khám phá phòng trọ
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomePageIntro;
