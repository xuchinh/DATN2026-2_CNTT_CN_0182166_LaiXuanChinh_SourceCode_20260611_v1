import StepList from "@/app/(root)/components/section/home-page-work-method/StepList";

const HomePageWorkMethod = () => {
  return (
    <section className="relative overflow-hidden bg-[#064E3B] py-20 lg:py-28">
      {/* Hình khối nghệ thuật */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#059669]/40 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-72 w-72 rounded-full bg-[#10B981]/30 blur-3xl" />

      <div className="relative z-10 mx-auto w-11/12 max-w-[1200px]">
        <div className="mx-auto max-w-[640px] text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#6EE7B7]">
            Quy trình
          </span>
          <h2 className="mt-4 font-playfair text-[34px] font-bold leading-tight text-white md:text-[46px]">
            Bắt đầu chỉ với <span className="italic text-[#6EE7B7]">ba bước</span>
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Từ đăng ký đến quản lý toàn bộ nhà trọ — nhanh, gọn, không rườm rà.
          </p>
        </div>

        <div className="mt-14">
          <StepList />
        </div>
      </div>
    </section>
  );
};

export default HomePageWorkMethod;
