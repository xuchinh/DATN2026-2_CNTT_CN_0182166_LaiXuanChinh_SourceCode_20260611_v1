import { sendRequest } from "@/utils/api";
import { TypeBuildingProp, TypeRoomProp } from "../types/accommodation";
import { handleUpdateIncome } from "@/components/rooms/requests/room.requests";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export const handleAllBuildingByNameOrAddress = async (searchText?: string) => {
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<{
        meta: { current: number; pageSize: number; pages: number; total: number };
        results: TypeBuildingProp[];
    }>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings`,
        method: "GET",
        queryParams: {
            current,
            pageSize,
            search: searchText
        },
        nextOption: {
            next: { tags: ["list-buildings"] },
        },
    });
};

export const handleAllRoom = async (buildingId?: string, userId?: string) => {
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<{
        meta: { current: number; pageSize: number; pages: number; total: number };
        results: TypeRoomProp[];
    }>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
        method: "GET",
        queryParams: { current, pageSize, buildingId: buildingId, userId: userId },
        nextOption: {
            next: { tags: ["list-rooms"] },
        },
    });
};


export const handleUpdateRoom = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    });

    if (data.buildingId) {
        await handleUpdateIncome(data.buildingId);
    }

    revalidateTag("list-rooms");
    return res;
};