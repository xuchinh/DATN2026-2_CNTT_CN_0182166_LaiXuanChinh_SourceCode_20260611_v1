import type { TypeRefundPolicyProp } from "../../types/refund-policy";
type RefundPolicyItemProps = {
  refundPolicyItemProp: TypeRefundPolicyProp;
};

const RefundPolicyItem = ({ refundPolicyItemProp }: RefundPolicyItemProps) => {
  return (
    <div className="lg:max-w-[1090px]">
      <h2 className="text-left font-playfair font-bold text-[22px] lg:text-[25px] lg:leading-[45px] leading-[35px]">
        <span className="text-left font-playfair font-bold text-[22px] lg:text-[25px] lg:leading-[45px] leading-[35px]">
          {refundPolicyItemProp.id}
        </span>
        {". "}
        {refundPolicyItemProp.refundPolicyTitle}
      </h2>
      <p className="text-left text-base lg:text-[16px] lg:leading-[45px] font-normal leading-[35px]">
        {refundPolicyItemProp.contentTitle}{" "}
        <span className=" font-bold text-left text-base lg:text-[16px] lg:leading-[45px] leading-[35px]">
          {refundPolicyItemProp.spanContentTitle}
        </span>
      </p>
      {refundPolicyItemProp.mainContents.map((contentItem, index) => (
        <ul
          key={index}
          className="text-left text-base lg:text-[16px] lg:leading-[45px] font-normal leading-[35px] list-disc pl-6"
        >
          {contentItem.email && (
            <li>
              <span>Email: </span>
              <span className="text-blue-500 underline">
                {contentItem.email}
              </span>
            </li>
          )}
          {contentItem.phoneNumble && (
            <li>
              <span>Số điện thoại: </span>
              <span className="text-blue-500 underline">
                {contentItem.phoneNumble}
              </span>
            </li>
          )}
          {contentItem.mainContent && <li>{contentItem.mainContent}</li>}
        </ul>
      ))}
    </div>
  );
};
export default RefundPolicyItem;
