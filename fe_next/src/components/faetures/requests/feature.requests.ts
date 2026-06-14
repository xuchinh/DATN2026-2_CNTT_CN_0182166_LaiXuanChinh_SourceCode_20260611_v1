'use server'
import { auth } from "@/auth";
import { sendRequest } from "../../../utils/api";
import { revalidateTag } from "next/cache";
import { IFeature } from "../types/feature.type";

export const handleFeature = async (searchParams: { [key: string]: any }) => {
    const session = await auth();
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;


    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/features`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-features"] },
        },
    });
};

export const handleCreateFeature = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/features`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-features")
    return res;
}

export const handleUpdateFeature = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/features`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-features")
    return res;
}

export const handleDeleteFeature = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/features/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    })

    revalidateTag("list-features")
    return res;
}

// export const fetchFeatures = async (): Promise<IFeature[]> => {
//     const session = await auth();
//     const current = 1;
//     const pageSize = 10000;


//     return await sendRequest<IBackendRes<any>>({
//         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/features`,
//         method: "GET",
//         queryParams: { current, pageSize },
//         headers: {
//             Authorization: `Bearer ${session?.user?.access_token}`,
//         },
//         nextOption: {
//             next: { tags: ["list-features"] },
//         },
//     });
// };

export const fetchFeatures = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 1000;


    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/features`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-features"] },
        },
    });
};