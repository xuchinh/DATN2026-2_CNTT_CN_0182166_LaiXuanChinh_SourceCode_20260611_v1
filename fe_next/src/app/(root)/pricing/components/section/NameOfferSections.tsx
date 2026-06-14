type NameOfferSectionsPorp = {
  discountPercentage?: number;
  discountAmount?: string;
};
const NameOfferSections = ({
  discountAmount,
  discountPercentage,
}: NameOfferSectionsPorp) => {
  const formattedPrice =
    discountAmount &&
    parseInt(discountAmount).toLocaleString("vi-VN").replace(/\./g, ",");
  return (
    <h2 className="font-playfair font-bold text-[32px] lg:text-[36px] leading-[120%] capitalize text-[#EEB537]  pb-[7px]">
      Giảm{" "}
      <span className="text-[56px] lg:text-[60px] font-playfair font-bold capitalize text-[#EEB537]">
        {discountPercentage ? (
          <>
            {discountPercentage}
            <span className="font-playfair font-bold text-[32px] lg:text-[36px] leading-[120%] capitalize text-[#EEB537]  pb-[7px]">
              {" "}
              %
            </span>
          </>
        ) : (
          <>
            <br />
            {formattedPrice}
            <span className="font-playfair font-bold text-[32px] lg:text-[36px] leading-[120%] capitalize text-[#EEB537]  pb-[7px]">
              {" "}
              VNĐ
            </span>
          </>
        )}
      </span>
    </h2>
  );
};
export default NameOfferSections;
