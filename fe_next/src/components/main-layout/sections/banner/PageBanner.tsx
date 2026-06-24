import { cn } from "../../utils/classname";

type PageBannerProps = {
  title?: string;
  description?: string; // giữ để tương thích, không hiển thị
  titleClassName?: string;
};

// Dải nền gradient xanh lá nhạt dần xuống nền sáng.
// Hiển thị tiêu đề CHỈ khi được truyền `title` (dùng cho trang chi tiết blog);
// các trang khác để trống, chỉ còn dải nền.
const PageBanner = ({ title, titleClassName }: PageBannerProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#047857] via-[#059669] to-[#f5f5f7] pb-28 pt-[140px] text-center">
      {/* Hình khối nghệ thuật (phần trên, nơi nền còn đậm) */}
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -left-10 -top-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute right-[12%] top-[34%] h-40 w-40 rounded-full border border-white/20" />
      <div className="absolute left-[14%] top-[40%] h-20 w-20 rotate-45 rounded-2xl bg-white/10" />

      {title && (
        <div className="relative z-10 mx-auto w-11/12 max-w-[900px]">
          <h1
            className={cn(
              "font-playfair text-[32px] font-bold leading-tight text-white drop-shadow-sm md:text-[48px]",
              titleClassName,
            )}
          >
            {title}
          </h1>
        </div>
      )}
    </section>
  );
};

export default PageBanner;
