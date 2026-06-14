import Image from "next/image";

const reviews = [
  {
    id: 1,
    text: 'Website của RoomHub đã thay đổi cách tôi quản lý nhà trọ. Mọi thứ trở nên dễ dàng và hiệu quả hơn rất nhiều!"',
    name: "Nguyen Van A",
    role: "Chủ nhà trọ",
    nameFirst: true,
    avatarBg: "#D4956A",
    avatarSide: "left" as const,
    cardOffset: false,
  },
  {
    id: 2,
    text: "Tôi rất hài lòng với dịch vụ và sự hỗ trợ từ đội ngũ của RoomHub. Họ luôn sẵn sàng giúp đỡ mỗi khi tôi cần",
    name: "Nguyễn Hồng Quân",
    role: "Chủ nhà trọ",
    nameFirst: false,
    avatarBg: "#7B5E3A",
    avatarSide: "right" as const,
    cardOffset: true,
  },
  {
    id: 3,
    text: 'Website của RoomHub đã thay đổi cách tôi quản lý nhà trọ. Mọi thứ trở nên dễ dàng và hiệu quả hơn rất nhiều!"',
    name: "Ahsan Mulia",
    role: "Chủ nhà trọ",
    nameFirst: true,
    avatarBg: "#5B84A8",
    avatarSide: "left" as const,
    cardOffset: false,
  },
];

const HomePageReview = () => {
  return (
    <div className="bg-[#FAF5FF]">
      <div className="max-w-[1243px] mx-auto relative">
        <div className="flex ">
          {/* left side - text */}
          <div className="w-1/2 ">
            {/* image decoration */}
            <div className="absolute flex">
              <Image
                src="/images/home-page/review-decoration.png"
                width={165}
                height={412}
                alt="review decoration picture"
                className="mr-11"
              />
              <Image
                src="/images/home-page/review-decoration.png"
                width={165}
                height={412}
                alt="review decoration picture"
              />
            </div>
            <div className="pt-[214px] ">
              <h1 className="max-w-[405px] text-[#F97316] font-playfair text-[50px] italic font-medium mb-[11.5px] ">
                Đánh Giá
                <span className="text-[#4C1D95] font-playfair">
                  {" "}
                  Từ Khách Hàng
                </span>
              </h1>
              <p className="max-w-[464px] text-[#313A5A] font-sans text-lg font-normal leadding-[160%] mb-7  ">
                Chúng tôi luôn lắng nghe ý kiến của bạn! Đọc những đánh giá mới
                nhất từ người dùng về trải nghiệm với phần mềm của chúng tôi
              </p>
              <div className="">
                <Image
                  src="/images/home-page/avatar.png"
                  width={153}
                  height={60}
                  alt="avatar reviewer picture"
                />
              </div>
            </div>
          </div>
          {/* right side - review cards */}
          <div className="w-1/2 pt-[99.2px] pb-[109px] pl-8 pr-10">
            <div className="flex flex-col gap-3">
              {reviews.map((review) => (
                <div key={review.id}>
                  <div
                    className={`relative bg-white rounded-2xl shadow-sm py-5 ${
                      review.avatarSide === "left" ? "pl-8 pr-6" : "pl-6 pr-8"
                    } ${review.cardOffset ? "ml-14" : ""}`}
                    style={{ maxWidth: "400px" }}
                  >
                    {/* avatar */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        review.avatarSide === "left" ? "-left-5" : "-right-5"
                      }`}
                      style={{ backgroundColor: review.avatarBg }}
                    >
                      {review.name
                        .split(" ")
                        .slice(-2)
                        .map((w) => w[0])
                        .join("")}
                    </div>

                    <p className="text-[#5C6787] text-sm leading-relaxed mb-4">
                      {review.text}
                    </p>

                    <div className="flex justify-between items-center text-sm">
                      {review.nameFirst ? (
                        <>
                          <span className="font-bold text-[#4C1D95]">
                            {review.name}
                          </span>
                          <span className="text-[#9CA3AF]">{review.role}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[#9CA3AF]">{review.role}</span>
                          <span className="font-bold text-[#4C1D95]">
                            {review.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* yellow accent bar */}
                  <div
                    className={`mt-2 w-14 h-[6px] bg-[#F97316] rounded-full ${
                      review.cardOffset ? "ml-14" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageReview;
