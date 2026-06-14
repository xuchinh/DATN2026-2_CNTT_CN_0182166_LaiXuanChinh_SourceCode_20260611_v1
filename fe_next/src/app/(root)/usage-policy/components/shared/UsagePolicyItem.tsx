import type { TypeUsagePolicyProp } from "../../types/usage-policy";
type UsagePolicyItemProps = {
  usagePolicyItemProp: TypeUsagePolicyProp;
};

const UsagePolicyItem = ({ usagePolicyItemProp }: UsagePolicyItemProps) => {
  return (
    <div className="lg:max-w-[1090px]">
      <h2 className="text-left font-playfair font-bold text-[22px] lg:text-[25px] lg:leading-[45px] leading-[35px]">
        <span className="text-left font-playfair font-bold text-[22px] lg:text-[25px] lg:leading-[45px] leading-[35px]">
          {usagePolicyItemProp.id}
        </span>
        {". "}
        {usagePolicyItemProp.usagePolicyTitle}
      </h2>
      <p className="text-left text-base lg:text-[16px] lg:leading-[45px] font-normal leading-[35px]">
        {usagePolicyItemProp.contentTitle}
      </p>
      {usagePolicyItemProp.mainContents.map((contentItem, index) => (
        <ul
          key={index}
          className="text-left text-base lg:text-[16px] lg:leading-[45px] font-normal leading-[35px] list-disc pl-6"
        >
          {contentItem.email && (
            <li>
              <span className=" text-left text-base lg:text-[16px] lg:leading-[45px] leading-[35px]">
                Email:{" "}
              </span>{" "}
              <span className="text-blue-500 underline">
                {contentItem.email}
              </span>
            </li>
          )}
          {contentItem.phoneNumble && (
            <li>
              <span className="text-left text-base lg:text-[16px] lg:leading-[45px] leading-[35px]">
                Số điện thoại:{" "}
              </span>
              <span className="text-blue-500 underline">
                {contentItem.phoneNumble}
              </span>
            </li>
          )}
          {/* rights */}
          {contentItem.rightsTitle && (
            <li>
              <span className=" font-bold text-left text-base lg:text-[16px] lg:leading-[45px] leading-[35px]">
                Quyền:{" "}
              </span>{" "}
              {contentItem.rightsTitle}
            </li>
          )}
          {contentItem.rights && (
            <li className="list-none">
              {contentItem.rights.map((rightsItem, value) => (
                <ul
                  key={value}
                  className="text-left text-base lg:text-[16px] lg:leading-[45px] font-normal leading-[35px] list-disc pl-6"
                >
                  <li>{rightsItem.rightContent}</li>
                </ul>
              ))}
            </li>
          )}
          {/* responsibility */}
          {contentItem.responsibilityTitle && (
            <li>
              <span className=" font-bold text-left text-base lg:text-[16px] lg:leading-[45px] leading-[35px]">
                Trách nhiệm:{" "}
              </span>{" "}
              {contentItem.responsibilityTitle}
            </li>
          )}
          {contentItem.responsibilitys && (
            <li className="list-none">
              {contentItem.responsibilitys.map((responsibilitysItem, value) => (
                <ul
                  key={value}
                  className="text-left text-base lg:text-[16px] lg:leading-[45px] font-normal leading-[35px] list-disc pl-6"
                >
                  <li>{responsibilitysItem.responsibilityContent}</li>
                </ul>
              ))}
            </li>
          )}
        </ul>
      ))}
    </div>
  );
};
export default UsagePolicyItem;
