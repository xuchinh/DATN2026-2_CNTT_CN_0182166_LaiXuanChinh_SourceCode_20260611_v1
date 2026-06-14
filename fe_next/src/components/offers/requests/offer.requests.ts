'use server'
import { auth } from "@/auth";
import { sendRequest } from "../../../utils/api";
import { revalidateTag } from "next/cache";

export const handleOffer = async (searchParams: { [key: string]: any }) => {
    const session = await auth();
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;


    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-offers"] },
        },
    });
};

export const handleCreateOffer = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-offers")
    return res;
}

export const handleUpdateOffer = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-offers")
    return res;
}

export const handleDeleteOffer = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    })

    revalidateTag("list-offers")
    return res;
}
