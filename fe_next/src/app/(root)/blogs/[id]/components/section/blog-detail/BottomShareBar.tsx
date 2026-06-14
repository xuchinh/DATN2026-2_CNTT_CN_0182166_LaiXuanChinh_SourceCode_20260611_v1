"use client";
import {
  FacebookShareButton,
  InstapaperShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";


import SVGFacebook from "../../svgs/SVGFacebook";
import SVGFrame from "../../svgs/SVGFrame";
import SVGInstagram from "../../svgs/SVGInstagram";
import SVGTwitter from "../../svgs/SVGTwitter";

type Sharebar = {
  id: string;
  title: string;
  dateShare: string;
  authorName: string;
};
const BottomShareBar = ({ id, title, dateShare, authorName }: Sharebar) => {
  const shareUrl = `http://localhost:3000/blogs/${id}`;

  return (
    <section className="lg:flex items-center justify-between">
      <div>
        <p className="text-[18px] font-normal leading-[28.8px] text-left">
          Đăng ngày <span>{dateShare}</span>
          {" bởi "} <span className="text-[#8828FF]">{authorName}</span>
        </p>
      </div>
      <div className="flex items-center justify-center ">
        <p className="text-[18px] font-normal leading-[28.8px] text-left">
          Chia sẻ bài viết này:
        </p>

        <TelegramShareButton url={shareUrl} title={title}>
          <div className="ml-5 flex h-[35px] w-[35px] items-center justify-center  rounded-full cursor-pointer">
            <SVGFrame className="w-[30px] h-[31px]" />
          </div>
        </TelegramShareButton>

        <FacebookShareButton url={shareUrl} title={title}>
          <div className="ml-5 flex h-[35px] w-[35px] items-center justify-center  rounded-full cursor-pointer">
            <SVGFacebook className="w-[30px] h-[31px]" />
          </div>
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={title}>
          <div className="ml-5 flex h-[35px] w-[35px] items-center justify-center rounded-full cursor-pointer">
            <SVGTwitter className="w-[30px] h-[31px]" />
          </div>
        </TwitterShareButton>

        <InstapaperShareButton url={shareUrl} title={title}>
          <div className="ml-5 flex h-[35px] w-[35px] items-center justify-center rounded-full cursor-pointer">
            <SVGInstagram className="w-[30px] h-[31px]" />
          </div>
        </InstapaperShareButton>
      </div>
    </section>
  );
};
export default BottomShareBar;
