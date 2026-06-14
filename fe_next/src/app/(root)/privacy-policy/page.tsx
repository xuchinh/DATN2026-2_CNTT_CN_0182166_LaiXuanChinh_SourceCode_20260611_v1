import type { Metadata } from "next";

import PrivacyPolicySections from "./components/section/PrivacyPolicySections";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật",
  description:
    "Tìm hiểu về các chính sách bảo mật khi sử dụng dịch vụ quản lý nhà trọ của chúng tôi.",
  keywords:
    "Chính sách bảo mật phần mềm nhà trọ, Quy định sử dụng phần mềm quản lý trọ.",
  alternates: {
    canonical: `http://localhost:3000/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicySections />;
}
