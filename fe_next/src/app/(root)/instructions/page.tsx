import type { Metadata } from "next";

import InstructionsSections from "./components/section/InstructionsSections";

export const metadata: Metadata = {
  title: "Hướng Dẫn Sử Dụng",
  description:
    "Hướng dẫn chi tiết cách sử dụng phần mềm quản lý nhà trọ. Xem video hướng dẫn và tải tài liệu để tối ưu hóa việc quản lý tài sản của bạn.",
  keywords:
    "Hướng dẫn sử dụng phần mềm quản lý nhà trọ, Tài liệu hướng dẫn quản lý nhà trọ, Video hướng dẫn sử dụng phần mềm, Cách quản lý nhà trọ hiệu quả.",
  alternates: {
    canonical: `http://localhost:3000/instructions`,
  },
};

const InstructionsPage = () => {
  return (
    <>
      <InstructionsSections></InstructionsSections>
    </>
  );
};
export default InstructionsPage;
