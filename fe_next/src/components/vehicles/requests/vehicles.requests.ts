'use server'
import { auth } from "@/auth";
import { sendRequest } from "../../../utils/api";
import { revalidateTag } from "next/cache";

export const handleRoom = async (searchBuildingId?: string, roomCode?: string) => {
    const session = await auth();
    const current = 1;
    const pageSize = 100000000000;
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
                        status: true,
                        pageSize,
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


export const handleVehicle = async (searchParams: { [key: string]: any }) => {
    const session = await auth();
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const search = searchParams?.search;
    const searchBuildingId = searchParams?.buildingId;
    const roomCode = searchParams?.roomCode;
    const status = searchParams?.status;
    const resRoom = await handleRoom(searchBuildingId, roomCode);
    const resultsRoom = resRoom?.data?.results ?? [];

    const allVehicleResponses = await Promise.all(
        resultsRoom.map((rooms: any) =>
            sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles`,
                method: "GET",
                queryParams: {
                    current: 1,
                    pageSize,
                    search,
                    status,
                    roomId: rooms._id
                },
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                nextOption: {
                    next: { tags: ["list-vehicles"] },
                },
            })
        )
    );
    const Vehicle = allVehicleResponses.flatMap((res) => res?.data?.results || []);
    const total = Vehicle.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedRooms = Vehicle.slice((current - 1) * pageSize, current * pageSize);

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

export const handleVehicleById = async (id: string) => {
    const session = await auth();
    const resRoom = await handleRoom();
    const resultsRoom = resRoom?.data?.results ?? [];

    const allVehicleResponses = await Promise.all(
        resultsRoom.map((rooms: any) =>
            sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles`,
                method: "GET",
                queryParams: {
                    _id: id,
                    roomId: rooms._id
                },
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                nextOption: {
                    next: { tags: ["list-vehicles"] },
                },
            })
        )
    );

    const Vehicle = allVehicleResponses.flatMap((res) => res?.data?.results || []);
    return {
        data: {
            results: Vehicle,
        },
    };
};

export const handleUpdateVehicle = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("vehicles")
    return res;
}

export const handleConfirmVehicle = async (id: string, status: string) => {
    const session = await auth();
    const resVehicle = await handleVehicleById(id)
    const newFromDate = resVehicle.data.results[0]?.toDate;
    const newToDate = new Date();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { _id: id, status: status, fromDate: newFromDate, toDate: newToDate }
    })
    revalidateTag("list-vehicles")
    return res;
}


export const handleDeleteVehicle = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    })

    revalidateTag("list-vehicles")
    return res;
}

export const handleBuilding = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings`,
        method: "GET",
        queryParams: { current, pageSize, userId: session?.user?._id },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-buildings"] },
        },
    });
};
