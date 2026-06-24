"use client";

import { useEffect, useState } from "react";

import { handleOffer } from "../../requests/offers.request";
import { handlePackage } from "../../requests/package.request";
import type {
  TypeFeatureProp,
  TypeOffersItemProp,
  TypePriceItemProp,
} from "../../types/price-item";
import PriceItem from "../shared/PriceItem";
import NameOfferSections from "./NameOfferSections";
import { handleFeature } from "../../requests/feature.requet";
import BuyPackageModal from "../shared/BuyPackageModal";

type PriceSectionsListProps = {
  bgImageItemBanner: string;
  bgImageItem: string;
};
const PriceSectionsList = ({
  bgImageItem,
  bgImageItemBanner,
}: PriceSectionsListProps) => {
  const [priceItemList, setPriceItemList] = useState<TypePriceItemProp[]>([]);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TypePriceItemProp | null>(null);
  useEffect(() => {
    const fetchPricingData = async () => {
      const resPackage = await handlePackage();
      const PriceItemListOriginal: TypePriceItemProp[] = resPackage?.data?.results
      setPriceItemList(PriceItemListOriginal);
    };

    fetchPricingData();
  }, []);

  const [offersList, setOffersList] = useState<TypeOffersItemProp[]>([]);
  useEffect(() => {
    const fetchOffer = async () => {
      const resOffer = await handleOffer();
      const OfferItemList: TypeOffersItemProp[] = resOffer?.data?.results
      setOffersList(OfferItemList);
    };

    fetchOffer();
  }, []);

  const [featuresList, setFeaturesList] = useState<TypeFeatureProp[]>([]);
  useEffect(() => {
    const fetchFeatures = async () => {
      const resFeature = await handleFeature();
      const featuresItemList: TypeFeatureProp[] = resFeature?.data?.results
      setFeaturesList(featuresItemList);
    };

    fetchFeatures();
  }, []);

  return (
    <section className="relative z-10 mx-auto -mt-20 w-11/12 max-w-[1280px] pb-16 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-[2] pt-4">
        {priceItemList.map((priceItem) => (
          <div
            onClick={() => {
              setSelectedPackage(priceItem);
              setOpenBuyModal(true);
            }}
            key={priceItem._id}
            className="w-[340.672px] lg:w-[400px] flex-shrink-0 lg:rounded-t-3xl lg:rounded-b-[20px] rounded-[20px] aspect-[400/577] text-[#313A5A] bg-white hover:shadow-[0px_-6px_64px_0px_rgba(0,_0,_0,_0.15)] cursor-pointer"
          >
            <PriceItem
              priceItemProp={priceItem}
              bgImageItemBanner={bgImageItemBanner}
              textItemClassName="text-[#313A5A]"
              textItemClassNameBanner=" text-[#EEB537]"
              bgImageItemClassName="hidden"
              featuresList={featuresList}
            />
          </div>
        ))}
        {/* Mỗi offer là 1 card riêng */}
        {offersList.map((offerItem) => (
          <div
            key={offerItem._id}
            className="w-[340.672px] lg:w-[400px] flex-shrink-0 lg:rounded-t-3xl lg:rounded-b-[20px] rounded-[20px] aspect-[400/577] text-[#313A5A] bg-white hover:shadow-[0px_-6px_64px_0px_rgba(0,_0,_0,_0.15)]"
          >
            {/* Banner header */}
            <div className="relative w-full rounded-tl-[20px] rounded-tr-[20px] aspect-[400/168] flex items-center overflow-hidden bg-gradient-to-br from-[#34D399] via-[#10B981] to-[#059669]">
              <div className="absolute pl-[41px] py-5 z-10">
                <p className="text-white text-[14px] font-normal uppercase tracking-widest pb-1 opacity-80">
                  Khuyến mãi
                </p>
                <h1 className="text-[#EEB537] font-playfair text-[22px] lg:text-[24px] font-bold leading-[38.4px]">
                  {offerItem.name}
                </h1>
              </div>
            </div>

            {/* Content */}
            <div className="px-[41px] py-6 flex flex-col gap-3">
              {/* Discount amount */}
              <NameOfferSections
                discountPercentage={Number(offerItem.discountPercentage) || undefined}
                discountAmount={Number(offerItem.discountPercentage) ? undefined : offerItem.discountCurrency}
              />

              {/* Condition */}
              <p className="text-[#313A5A] text-[18px] font-normal leading-[160%]">
                Áp dụng khi đăng ký{" "}
                <span className="font-bold text-[#EEB537]">
                  {offerItem.condition} tháng
                </span>
              </p>

              {/* Description */}
              {offerItem.description && (
                <p className="text-[#6B7280] text-[16px] lg:text-[18px] font-normal leading-[160%] border-t border-gray-100 pt-3 mt-1">
                  {offerItem.description}
                </p>
              )}
            </div>
          </div>
        ))}
        <BuyPackageModal
          open={openBuyModal}
          onClose={() => setOpenBuyModal(false)}
          packageData={selectedPackage}
        />
      </div>
    </section>
  );
};

export default PriceSectionsList;
