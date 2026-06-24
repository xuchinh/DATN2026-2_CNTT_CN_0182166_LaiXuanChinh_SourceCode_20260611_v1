const reviews = [
  {
    id: 1,
    text: "RoomHub đã thay đổi cách tôi quản lý nhà trọ. Mọi thứ trở nên dễ dàng và hiệu quả hơn rất nhiều!",
    name: "Nguyễn Văn An",
    role: "Chủ nhà trọ",
    avatarBg: "#059669",
  },
  {
    id: 2,
    text: "Tôi rất hài lòng với dịch vụ và sự hỗ trợ từ đội ngũ RoomHub. Luôn sẵn sàng giúp đỡ mỗi khi tôi cần.",
    name: "Nguyễn Hồng Quân",
    role: "Chủ nhà trọ",
    avatarBg: "#047857",
  },
  {
    id: 3,
    text: "Ghi điện nước và thu tiền giờ chỉ vài thao tác. Báo cáo doanh thu rõ ràng giúp tôi yên tâm hẳn.",
    name: "Trần Thu Hà",
    role: "Chủ nhà trọ",
    avatarBg: "#10B981",
  },
];

const getInitials = (name: string) =>
  name
    .trim()
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const HomePageReview = () => {
  return (
    <section className="bg-[#F6FBF8] py-20 lg:py-28">
      <div className="mx-auto grid w-11/12 max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Tiêu đề */}
        <div className="lg:col-span-5">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#059669]">
            Cảm nhận
          </span>
          <h2 className="mt-4 font-playfair text-[34px] font-bold leading-tight text-[#064E3B] md:text-[46px]">
            Khách hàng <span className="italic text-[#059669]">nói gì</span>
          </h2>
          <p className="mt-5 max-w-[420px] text-lg leading-relaxed text-[#3F5C50]">
            Những chia sẻ thật từ các chủ trọ đang vận hành cùng RoomHub mỗi ngày.
          </p>
        </div>

        {/* Các thẻ đánh giá */}
        <div className="flex flex-col gap-5 lg:col-span-7">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="rounded-[18px] border border-[#E2EFE8] bg-white p-7 transition-all duration-300 hover:shadow-[0_18px_40px_rgba(5,150,105,0.10)]"
            >
              <blockquote className="text-[17px] leading-relaxed text-[#1F2937]">
                “{review.text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-full text-[13px] font-bold text-white"
                  style={{ backgroundColor: review.avatarBg }}
                >
                  {getInitials(review.name)}
                </span>
                <div>
                  <p className="font-bold text-[#064E3B]">{review.name}</p>
                  <p className="text-[13px] text-[#6B8378]">{review.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePageReview;
