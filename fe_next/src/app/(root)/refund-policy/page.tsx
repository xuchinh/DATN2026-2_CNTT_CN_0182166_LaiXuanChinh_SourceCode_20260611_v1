import type { Metadata } from "next";
import RefundPolicySections from "./components/section/RefundPolicySections";

export const metadata: Metadata = {
  title: "Chính Sách Hoàn Tiền",
  description:
    "Tìm hiểu về quy định hoàn tiền khi sử dụng dịch vụ quản lý nhà trọ của chúng tôi.",
  keywords:
    "Chính sách hoàn tiền phần mềm nhà trọ, Quy định sử dụng phần mềm quản lý trọ.",
  alternates: {
    canonical: `http://localhost:3000/refund-policy`,
  },
};

export default function RefundPolicyPage() {
  return <RefundPolicySections />;
}
