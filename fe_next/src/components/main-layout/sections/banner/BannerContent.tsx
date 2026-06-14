import { cn } from "../../utils/classname";


type BannerContentsProps = {
  heading: string;
  supHeading?: string;
  description?: string;
  headingClassName?: string;
  supHeadingClassName?: string;
  descriptionClassName?: string;
  sizeBannerClassName?: string;
};

const BannerContents = ({
  heading,
  supHeading,
  description,
  headingClassName,
  supHeadingClassName,
  descriptionClassName,
  sizeBannerClassName,
}: BannerContentsProps) => {
  return (
    <section
      className={cn(
        "relative lg:pb-[18%] md:max-h-[431.5px] ",
        sizeBannerClassName,
      )}
    >
      <div className="h-full w-full px-3 pt-[184px]">
        <div className="mx-auto flex h-full flex-col items-center justify-center ">
          <h1
            className={cn(
              "text-center font-playfair text-[36px] md:text-[48px] lg:text-[64px] font-bold md:leading-[50px] lg:leading-[76.8px] text-white",
              headingClassName,
            )}
          >
            {heading}
          </h1>
          <h1
            className={cn(
              "text-center font-playfair text-[36px] md:text-[48px] lg:text-[64px] italic font-bold leading-[76.8px] text-[#EEB537] pb-6",
              supHeadingClassName,
            )}
          >
            {supHeading || ""}
          </h1>
          <p
            className={cn(
              "w-full h-[144px] lg:w-[694px] lg:h-[87px] font-inter lg:text-[18px] md:w-[576px] text-[16px] font-normal leading-[28.8px] text-center text-white",
              descriptionClassName,
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BannerContents;
