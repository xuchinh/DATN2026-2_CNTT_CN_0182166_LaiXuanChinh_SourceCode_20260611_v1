// import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";


export const handlePackage = async () => {

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/packages`,
        method: "GET",
        queryParams: { isActive: true },
        nextOption: {
            next: { tags: ["list-packages"] },
        },
    });
};