'use server'
import { auth } from "@/auth";
import { sendRequest } from "../../../utils/api";
import { revalidateTag } from "next/cache";
import { handleUserLogin, handleUserLoginStatus, handleUserLoginv2 } from "@/components/users/requests/user.requests";

export const handlePackage = async (searchParams: { [key: string]: any }) => {
    const session = await auth();
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const isActive = searchParams?.isActive;
    const search = searchParams?.search;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/packages`,
        method: "GET",
        queryParams: { current, pageSize, isActive, search },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-packages"] },
        },
    });
};

export const handleCreatePackage = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/packages`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-packages")
    return res;
}

export const handleUpdatePackage = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/packages`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-packages")
    return res;
}

export const handleDeletePackage = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/packages/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    })

    revalidateTag("list-packages")
    return res;
}

export const handleFeatureIsCode = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

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

export const handlePackageUser = async () => {
    const session = await auth();
    const userId = session?.user?._id;

    if (!userId) return null;

    const resUser = await handleUserLoginv2();
    const user = resUser?.data?.results?.[0];

    if (!user?.packageId) return null;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/packages`,
        method: "GET",
        queryParams: {
            current: 1,
            pageSize: 1,
            _id: user.packageId,
        },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-packages"] },
        },
    });
};