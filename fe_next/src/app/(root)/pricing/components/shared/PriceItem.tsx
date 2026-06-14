import clsx from "clsx";
import Image from "next/image";

import type { TypeFeatureProp, TypePriceItemProp } from "../../types/price-item";
import SVGTick from "../svgs/SVGTick";
import SVGTickWhire from "../svgs/SVGTickWhire";

type PriceItemOfficial = {
  priceItemProp: TypePriceItemProp;
  bgImageItemBanner?: string;
  bgImageItem?: string;
  bgImageItemClassName?: string;
  bgImageItemBannerClassName?: string;
  textItemClassNameBanner?: string;
  textItemClassName?: string;
  featuresList: TypeFeatureProp[]
};

const PriceItem = ({
  priceItemProp,
  bgImageItemBanner,
  bgImageItem,
  bgImageItemClassName,
  bgImageItemBannerClassName,
  textItemClassNameBanner,
  textItemClassName,
  featuresList,
}: PriceItemOfficial) => {
  const formattedPrice =
    priceItemProp.price &&
    parseInt(priceItemProp.price).toLocaleString("vi-VN").replace(/\./g, ",");
  return (
    <>
      <div
        className={clsx(
          "absolute w-[340.672px] lg:w-[400px] rounded-tl-[20px] rounded-tr-[20px] rounded-bl-lg rounded-br-lg aspect-[400/577]",
          bgImageItemClassName,
        )}
      >
        <Image
          src={bgImageItem || ""}
          alt="banner"
          className="object-cover"
          fill
        />
      </div>
      <div className="lg:w-[400px] flex-shrink-0 rounded-tl-[20px] rounded-tr-[20px] rounded-bl-lg rounded-br-lg aspect-[400/168]">
        <div
          className={clsx(
            "absolute w-[340.672px] lg:w-[400px] rounded-tl-[20px] rounded-tr-[20px] rounded-bl-lg rounded-br-lg aspect-[400/168]",
            bgImageItemBannerClassName,
          )}
        >
          <Image
            src={bgImageItemBanner || ""}
            alt="banner"
            className="object-cover"
            fill
          />
        </div>
        <div className="absolute lg:pl-[41px] lg:py-5 py-4 z-2 pl-[36px]">
          <h1
            className={clsx(
              " font-playfair text-xl lg:text-2xl font-bold leading-[38.4px] pb-[10px]",
              textItemClassNameBanner,
            )}
          >
            {priceItemProp.name}
          </h1>

          <div>
            <p
              className={clsx(
                " text-[18px] font-normal lg:leading-[32px]",
                textItemClassNameBanner,
              )}
            >
              Phí Dịch Vụ:
            </p>
            <p
              className={clsx(
                " text-[30px] lg:text-[30px] font-bold leading-[39.6px] capitalize",
                textItemClassNameBanner,
              )}
            >
              {formattedPrice}{" "}
              <span className="text-[20px] font-normal leading-[32px]">
                / tháng
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="lg:px-[41px] px-[36px] min-w-[307px] max-w-[340.67px] py-[23px] absolute z[2] lg:max-w-[400px]">
        <p
          className={clsx(
            " text-[20px] font-semibold leading-[24px] capitalize w-[279px] pb-[13px]",
            textItemClassName,
          )}
        >
          {priceItemProp.description}
        </p>
        <p
          className={clsx(
            " text-[20px] leading-[24px] w-[279px] pb-[13px]",
            textItemClassName,
          )}
        >
          Gói hỗ trợ quản lý: {priceItemProp.totalBuilding} nhà.
        </p>
        <ul
          className={clsx(
            "list-none text-[18px] font-normal leading-[28.8px] w-[300.701px]",
            textItemClassName,
          )}
        >
          {priceItemProp.features.map((featureId, index) => {
            const feature = featuresList.find(f => f._id === featureId);
            return (
              <li
                key={index}
                className="py-[4px] lg:py-[6px] flex items-start max-w-[280px] lg:max-w-[376.3px] lg:min-w-[300.7px]"
              >
                <span className="w-[20px] h-[20px] pt-[3px]">
                  <SVGTick />
                </span>
                <span className="pl-2 min-w-[290px]">
                  {feature ? feature.displayName : "Không tìm thấy"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
export default PriceItem;
