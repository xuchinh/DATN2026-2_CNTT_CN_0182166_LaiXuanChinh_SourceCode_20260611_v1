import Image from "next/image";

const BannerImage = () => {
  return (
    <section
      className={
        " pb-[18%] min-h-[849px] lg:aspect-[1941/849] absolute z-0 top-0 l-0 w-full"
      }
    >
      <div className={"absolute left-0 top-0 h-full w-full "}>
        <Image
          src="/images/banner-image/price-banner.png"
          alt="banner"
          className="object-cover"
          fill
        />
      </div>
    </section>
  );
};
export default BannerImage;
