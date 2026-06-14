import type { Metadata } from "next";

import PriceSections from "./components/section/PriceSections";

export const metadata: Metadata = {
  title: "Bảng Giá",
  description:
    "Chọn gói dịch vụ phù hợp với nhu cầu của bạn. Các gói giá linh hoạt, từ cơ bản đến cao cấp, đáp ứng mọi quy mô quản lý nhà trọ.",
  keywords:
    "Bảng giá phần mềm quản lý nhà trọ, Gói dịch vụ quản lý nhà trọ, Chi phí phần mềm nhà trọ, Giá phần mềm quản lý phòng trọ.",
  alternates: {
    canonical: `http://localhost:3000/pricing`,
  },
};

const PricePage = () => {
  return <PriceSections></PriceSections>;
};
export default PricePage;
