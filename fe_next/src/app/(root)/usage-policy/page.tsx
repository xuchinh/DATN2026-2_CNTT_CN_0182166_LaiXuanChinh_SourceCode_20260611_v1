import type { Metadata } from "next";

import UsagePolicySections from "./components/section/UsagePolicySections";

export const metadata: Metadata = {
  title: "Chính Sách Sử Dụng",
  description:
    "Tìm hiểu về điều khoản sử dụng khi sử dụng dịch vụ quản lý nhà trọ của chúng tôi.",
  keywords:
    "Điều khoản sử dụng dịch vụ nhà trọ, Quy định sử dụng phần mềm quản lý trọ.",
  alternates: {
    canonical: `http://localhost:3000/usage-policy`,
  },
};

export default function UsagePolicyPage() {
  return <UsagePolicySections />;
}
