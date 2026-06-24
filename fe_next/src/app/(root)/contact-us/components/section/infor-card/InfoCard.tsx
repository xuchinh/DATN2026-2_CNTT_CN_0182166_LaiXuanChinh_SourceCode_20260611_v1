import {
  CustomerServiceOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";

const contactItems = [
  {
    icon: <EnvironmentOutlined className="text-[20px]" />,
    label: "Địa chỉ",
    value: "Phúc Thắng, Rạng Đông, Ninh Bình",
    href: "https://maps.app.goo.gl/Z7i5WZ6G1RwkNQbz9",
    isLink: true,
  },
  {
    icon: <MailOutlined className="text-[20px]" />,
    label: "Email",
    value: "laixuanchinh@gmail.com",
    href: "mailto:laixuanchinh@gmail.com",
    isLink: true,
  },
  {
    icon: <PhoneOutlined className="text-[20px]" />,
    label: "Điện thoại",
    value: "0916 602 763",
    href: "tel:0916602763",
    isLink: true,
  },
];

const InfoCard = () => {
  return (
    <div className="mb-12">
      <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_4px_40px_rgba(5,150,105,0.10)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px]">
          {/* ─── Cột trái: nội dung liên hệ ─── */}
          <div className="flex flex-col justify-center gap-8 px-10 py-14 lg:px-16">
            {/* Badge */}
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ECFDF5] px-4 py-1.5 text-[13px] font-semibold uppercase tracking-widest text-[#059669]">
              <MessageOutlined />
              Liên hệ với chúng tôi
            </span>

            {/* Tiêu đề */}
            <h1 className="font-playfair text-[2.4rem] font-bold leading-[1.15] text-[#064E3B] lg:text-[3rem]">
              Chúng tôi luôn<br />
              <span className="text-[#059669]">sẵn sàng hỗ trợ</span>
            </h1>

            {/* Mô tả */}
            <p className="max-w-[500px] text-[17px] leading-[1.75] text-[#374151]">
              Đội ngũ RoomHub sẵn sàng giải đáp mọi thắc mắc của bạn — dù là về phần mềm, gói đăng ký, hay hỗ trợ kỹ thuật. Hãy liên hệ qua một trong các kênh dưới đây.
            </p>

            {/* Các mục liên hệ */}
            <div className="flex flex-col gap-4">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-[16px] border border-[#E5E7EB] bg-[#F9FAFB] p-4 transition-all duration-200 hover:border-[#A7F3D0] hover:shadow-[0_4px_16px_rgba(5,150,105,0.08)]"
                >
                  {/* Icon badge */}
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#34D399] to-[#059669] text-white">
                    {item.icon}
                  </div>
                  <div>
                    <p className="mb-0.5 text-[12px] font-bold uppercase tracking-widest text-[#6B7280]">
                      {item.label}
                    </p>
                    {item.isLink ? (
                      <a
                        href={item.href}
                        target={item.href?.startsWith("http") ? "_blank" : undefined}
                        className="text-[16px] font-medium text-[#059669] transition-colors hover:text-[#047857] hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-[16px] font-medium text-[#374151]">
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Cột phải: minh họa CSS art ─── */}
          <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-[#047857] via-[#059669] to-[#34D399] lg:flex">
            {/* Art shapes nền */}
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10" />
            <div className="absolute right-1/4 bottom-10 h-20 w-20 rounded-full bg-white/5" />

            {/* Icon trung tâm lớn */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white/20 shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                <CustomerServiceOutlined className="text-[72px] text-white drop-shadow-lg" />
              </div>

              {/* Mini cards nổi */}
              <div className="flex flex-col gap-3">
                {[
                  { icon: <MailOutlined />, text: "laixuanchinh@gmail.com" },
                  { icon: <PhoneOutlined />, text: "0916 602 763" },
                  { icon: <SendOutlined />, text: "Phản hồi trong 24 giờ" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-3 backdrop-blur-sm"
                  >
                    <span className="text-[18px] text-white">{item.icon}</span>
                    <span className="text-[14px] font-medium text-white/90">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
