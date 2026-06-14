import { sendRequest } from "@/utils/api";

export const handleFeature = async () => {
    const current = 1;
    const pageSize = 20;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/features`,
        method: "GET",
        queryParams: { current, pageSize },
        nextOption: {
            next: { tags: ["list-features"] },
        },
    });
};
