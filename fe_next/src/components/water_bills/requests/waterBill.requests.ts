'use server'
import { auth } from "@/auth";
import { sendRequest } from "../../../utils/api";
import { revalidateTag } from "next/cache";

export const handleRoom = async (searchParams?: { [key: string]: any }) => {
    const session = await auth();
    const current = 1;
    const pageSize = 100000000000;
    const searchBuildingId = searchParams?.buildingId;
    const roomCode = searchParams?.roomCode;
    const resBuilding = await handleBuilding();
    const resultsBuilding = resBuilding?.data?.results ?? [];
    let allRoomResponses = [];
    if (searchBuildingId) {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
            method: "GET",
            queryParams: {
                current,
                pageSize,
                status: true,
                code: roomCode,
                buildingId: searchBuildingId,
            },
            headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
            },
            nextOption: {
                next: { tags: ["list-rooms"] },
            },
        });
        allRoomResponses = [res];
    } else {
        allRoomResponses = await Promise.all(
            resultsBuilding.map((building: any) =>
                sendRequest<IBackendRes<any>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
                    method: "GET",
                    queryParams: {
                        current,
                        pageSize,
                        status: true,
                        code: roomCode,
                        buildingId: building._id,
                    },
                    headers: {
                        Authorization: `Bearer ${session?.user?.access_token}`,
                    },
                    nextOption: {
                        next: { tags: ["list-rooms"] },
                    },
                })
            )
        );
    }
    const allRooms = allRoomResponses.flatMap((res) => res?.data?.results || []);
    const total = allRooms.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedRooms = allRooms.slice((current - 1) * pageSize, current * pageSize);

    return {
        data: {
            results: paginatedRooms,
            meta: {
                current,
                pageSize,
                total,
                pages: totalPages,
            },
        },
    };

};


export const handleWaterBill = async (searchParams: { [key: string]: any }) => {
    const session = await auth();
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const status = searchParams?.status;
    const resRoom = await handleRoom(searchParams);
    const resultsRoom = resRoom?.data?.results ?? [];

    const allWaterBillResponses = await Promise.all(
        resultsRoom.map((rooms: any) =>
            sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/water-bills`,
                method: "GET",
                queryParams: {
                    current: 1,
                    pageSize,
                    status,
                    roomId: rooms._id
                },
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                nextOption: {
                    next: { tags: ["list-water-bills"] },
                },
            })
        )
    );
    const waterBill = allWaterBillResponses.flatMap((res) => res?.data?.results || []);

    const total = waterBill.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedRooms = waterBill.slice((current - 1) * pageSize, current * pageSize);

    return {
        data: {
            results: paginatedRooms,
            meta: {
                current,
                pageSize,
                total,
                pages: totalPages,
            },
        },
    };
};


// export const handleCreateRoom = async (data: any) => {
//     const session = await auth();
//     const res = await sendRequest<IBackendRes<any>>({
//         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${session?.user?.access_token}`,
//         },
//         body: { ...data }
//     })
//     revalidateTag("list-rooms")
//     return res;
// }
export const handleWaterBillById = async (id: string) => {
    const session = await auth();
    const resRoom = await handleRoom();
    const resultsRoom = resRoom?.data?.results ?? [];

    const allWaterBillResponses = await Promise.all(
        resultsRoom.map((rooms: any) =>
            sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/water-bills`,
                method: "GET",
                queryParams: {
                    roomId: rooms._id,
                    _id: id
                },
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                nextOption: {
                    next: { tags: ["list-water-bills"] },
                },
            })
        )
    );
    const waterBill = allWaterBillResponses.flatMap((res) => res?.data?.results || []);

    return {
        data: {
            results: waterBill,
        },
    };
};


export const handleUpdateWaterBill = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/water-bills`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("water-bills")
    return res;
}

export const handleConfirmWaterBill = async (id: string, status: string) => {
    const session = await auth();
    const resWaterBill = await handleWaterBillById(id)
    const newFromDate = resWaterBill.data.results[0]?.toDate;
    const newToDate = new Date();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/water-bills`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { _id: id, status: status, fromDate: newFromDate, toDate: newToDate }
    })
    revalidateTag("list-water-bills")
    return res;
}

export const handleConfirmWaterBillNotDate = async (id: string, status: string) => {
    const session = await auth();
    // const resWaterBill = await handleWaterBillById(id)

    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/water-bills`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { _id: id, status: status }
    })
    revalidateTag("list-water-bills")
    return res;
}

export const handleElWaterBillByRoomID = async (id: string) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/water-bills`,
        method: "GET",
        queryParams: { roomId: id },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-water-bills"] },
        },
    })

    return res;
};

export const handleBuilding = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings`,
        method: "GET",
        queryParams: { current, pageSize, userId: session?.user?._id },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-buildings"] },
        },
    });
};
// export const handleUser = async () => {
//     const session = await auth();
//     const current = 1;
//     const pageSize = 999999999;

//     return await sendRequest<IBackendRes<any>>({
//         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
//         method: "GET",
//         queryParams: { current, pageSize },
//         headers: {
//             Authorization: `Bearer ${session?.user?.access_token}`,
//         },
//         nextOption: {
//             next: { tags: ["list-users"] },
//         },
//     });
// };


export const handleAllBuilding = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-buildings"] },
        },
    });
};