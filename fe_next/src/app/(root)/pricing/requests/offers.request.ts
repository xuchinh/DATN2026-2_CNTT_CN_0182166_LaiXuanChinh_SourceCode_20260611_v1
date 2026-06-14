import { sendRequest } from "@/utils/api";

export const handleOffer = async () => {


  return await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers`,
    method: "GET",
    queryParams: { isActive: true },
    nextOption: {
      next: { tags: ["list-offers"] },
    },
  });
};
