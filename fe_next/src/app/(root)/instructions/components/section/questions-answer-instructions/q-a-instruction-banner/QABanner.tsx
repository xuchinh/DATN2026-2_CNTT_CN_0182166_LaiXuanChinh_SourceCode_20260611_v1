import SVGVector from "../../../svgs/SVGVector";

const QABanner = () => {
  return (
    <section className="container py-16">
      <div className="text-center font-playfair text-[64px] font-bold leading-[40px] md:leading-[45px]  lg:leading-[50px] capitalize flex items-center justify-center">
        Các câu hỏi thường gặp
      </div>
      <div className="flex items-center justify-center pt-[38px]">
        <SVGVector />
      </div>
    </section>
  );
};
export default QABanner;
