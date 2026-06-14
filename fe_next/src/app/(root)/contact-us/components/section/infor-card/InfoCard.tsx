import Image from "next/image";

const contactInfo = {
  discorverUs: {
    label: "KHÁM PHÁ CHÚNG TÔI",
    description:
      "Các chuyên gia của chúng tôi sẵn sàng trả lời bất kỳ câu hỏi nào bạn có thể có. Hãy liên hệ với chúng tôi qua các kênh của chúng tôi:",
  },
  visitUs: {
    label: "GHÉ THĂM CHÚNG TÔI",
    description: "Phúc Thắng, Rạng Đông, Ninh Bình"
  },
  email: {
    label: "EMAIL",
    description: "laixuanchinh@gmail.com"
  },
  phoneNumbers: {
    label: "ĐIỆN THOẠI",
    description: "0916602763"
  },
};

const InfoCard = () => {
  return (
    <div className="h-[770px] mobile:h-auto mobile:px-5">
      {/* content */}
      <div className="pl-[75px] py-[60px] pr-[36px] bg-white flex justify-between border-t rounded-[20px] mobile:flex-col mobile:px-[30px] mobile:py-[30px]">
        {/* text content */}
        <div className="flex flex-col gap-[42px]">
          <h1 className="max-w-[550px] text-[#20184E] font-playfair text-2xl md:text-5xl font-normal leading-[100%] hidden md:block">
            {contactInfo.discorverUs.label}
          </h1>
          <h1 className="max-w-[225px] text-[#20184E] font-playfair text-4xl md:text-5xl font-normal leading-[130%] block md:hidden">
            {contactInfo.discorverUs.label}
          </h1>
          <p className="max-w-[531px] text-[#313A5A] font-inter text-[22px] font-normal leading-[159%]">
            {contactInfo.discorverUs.description}
          </p>
          <div>
            <h3 className="max-w-[350px] text-[#20184E] md:text-[30px] font-normal leadding-[93.33%] text-2xl">
              {contactInfo.visitUs.label}
            </h3>
            <a
              href="https://maps.app.goo.gl/Z7i5WZ6G1RwkNQbz9"
              target="_blank"
              className="max-w-[401px] text-[#313A5A] font-inter text-xl font-normal leading-[175%] underline transition-all duration-500 inline-block"
            >
              <span className="max-w-[401px] text-[#313A5A] text-xl font-normal leading-[175%] underline transition-all duration-500 inline-block">
                {contactInfo.visitUs.description}
              </span>
            </a>
          </div>
          <div>
            <h3 className="text-[#20184E] font-inter text-2xl md:text-[30px] font-normal leadding-[106.667%%] mb-[7px]">
              {contactInfo.email.label}
            </h3>
            <div className="flex flex-col gap-2">
              <span className="text-[#09A4D8] font-inter text-[22px] font-normal leading-[159%]  transition-all duration-500">
                {contactInfo.email.description}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-[#20184E] font-inter text-2xl md:text-[30px] font-normal leading-[106.667%%] mb-[18px]">
              {contactInfo.phoneNumbers.label}
            </h3>
            <div className="flex flex-col gap-2">
              <span className="text-[#09A4D8] font-inter text-[17px] font-normal leading-[124%] underline  transition-all duration-500">
                {contactInfo.phoneNumbers.description}
              </span>
            </div>
          </div>
        </div>
        {/* picture */}
        <div className="mobile:mt-4">
          <Image
            src="/images/contact-us/discovery.png"
            width={537}
            height={620}
            alt="discovery us picture"
          />
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
