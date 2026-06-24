import Link from "next/link";

const HomePageSolutions = () => {
  return (
    <section className="bg-[#F6FBF8] py-20 lg:py-28">
      <div className="mx-auto grid w-11/12 max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Nội dung */}
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#059669]">
            Vì sao chọn RoomHub
          </span>
          <h2 className="mt-4 font-playfair text-[34px] font-bold leading-tight text-[#064E3B] md:text-[46px]">
            Một nơi gọn gàng cho
            <span className="italic text-[#059669]"> cả căn nhà của bạn</span>
          </h2>
          <p className="mt-5 max-w-[480px] text-lg leading-relaxed text-[#3F5C50]">
            Thay vì sổ sách rối rắm, bạn có một bảng điều khiển duy nhất: theo dõi
            phòng trống, ghi điện nước, thu tiền và xem doanh thu — tất cả đều rõ ràng.
          </p>
          <div className="mt-8">
            <Link
              href="/pricing"
              className="inline-block rounded-full bg-[#059669] px-8 py-4 font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#047857] hover:scale-[1.02]"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Hình khối nghệ thuật thay cho ảnh dashboard */}
        <div className="relative h-[360px]">
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#059669] to-[#10B981]" />
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#D1FAE5]" />
          <div className="absolute bottom-8 left-8 h-24 w-44 rounded-2xl bg-white/20 backdrop-blur" />
          <div className="absolute right-10 top-12 h-16 w-16 rotate-12 rounded-xl border-2 border-white/40" />
          <div className="absolute bottom-12 right-12 h-10 w-10 rounded-full bg-white/40" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
        </div>
      </div>
    </section>
  );
};

export default HomePageSolutions;
