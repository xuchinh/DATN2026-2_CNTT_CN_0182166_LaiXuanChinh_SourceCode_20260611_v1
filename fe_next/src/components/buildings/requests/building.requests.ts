'use server'
import { auth } from "@/auth";
import { sendRequest } from "../../../utils/api";
import { revalidateTag } from "next/cache";
import { handleRoom } from "@/components/rooms/requests/room.requests";

export const handleBuildingAdmin = async (searchParams: { [key: string]: any }) => {
    const session = await auth();
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const search = searchParams?.search;
    // Gọi danh sách buildings
    const buildingRes = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings`,
        method: "GET",
        queryParams: { current, pageSize, search, userId: session?.user?._id },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-buildings"] },
        },
    });

    const buildings = buildingRes?.data?.results ?? [];

    // Gọi toàn bộ rooms
    const allRoomRes = await handleRoom({ current: 1, pageSize: 999999 });
    const allRooms = allRoomRes?.data?.results ?? [];

    // Tính và cập nhật
    const updatedBuildings = await Promise.all(
        buildings.map(async (building: any) => {
            const rentedRooms = allRooms.filter(
                (room: any) => room.buildingId === building._id && room.status === true
            );
            const numberOfRoomsRented = rentedRooms.length;

            await handleUpdateBuilding({
                _id: building._id,
                numberOfRoomsRented,
            });

            return {
                ...building,
                numberOfRoomsRented,
            };
        })
    );
    return {
        data: {
            results: updatedBuildings,
            meta: buildingRes?.data?.meta,
        },
    };
};
export const handleCreateBuilding = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data, userId: session?.user?._id }
    })
    revalidateTag("list-buildings")
    return res;
}

export const handleUpdateBuilding = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-buildings")
    return res;
}

export const handleDeleteBuilding = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    })

    revalidateTag("list-buildings")
    return res;
}


// export const fetchIncomeStatistics = async () => {
//     const session = await auth();
//     const resBuilding = await handleBuildingUser();
//     const fullBuildingId = resBuilding.data?.results || [];
//     const buildingId = fullBuildingId[0]._id
//     console.log("check buildingId", buildingId);

//     return await sendRequest<IBackendRes<any>>({
//         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings/${buildingId}/income-statistics`,
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${session?.user?.access_token}`,
//         },
//         nextOption: {
//             next: { tags: ["list-income-statistics"] },
//         },
//     });
// };

export const fetchIncomeStatistics = async () => {
    const session = await auth();
    const resBuilding = await handleBuildingUser();
    const buildings = resBuilding.data?.results || [];

    if (buildings.length === 0) return [];

    // Gọi API income-statistics cho tất cả building
    const results = await Promise.all(
        buildings.map((building: any) =>
            sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings/${building._id}/income-statistics`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                nextOption: {
                    next: { tags: ["list-income-statistics"] },
                },
            }).then(res => ({
                buildingId: building._id,
                buildingName: building.name,
                incomeData: res.data || []
            }))
        )
    );

    return results;
};

// export const fetchWaterStatistics = async (buildingId: string) => {
//     const session = await auth();
//     const res = await sendRequest<IBackendRes<any>>({
//         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings/${buildingId}/water-statistics`,
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${session?.user?.access_token}`,
//         },
//         nextOption: {
//             next: { tags: ["list-water-incmone"] },
//         },
//     });
//     return res;
// };

// export const fetchElectricityStatistics = async (buildingId: string) => {
//     const session = await auth();
//     const res = await sendRequest<IBackendRes<any>>({
//         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings/${buildingId}/electricity-statistics`,
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${session?.user?.access_token}`,
//         },
//         nextOption: {
//             next: { tags: ["list-electricity-incmone"] },
//         },
//     });
//     return res;
// };



export const handleBuildingUser = async () => {
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


export const fetchWaterStatistics = async () => {
    const session = await auth();
    const resBuilding = await handleBuildingUser();
    const buildings = resBuilding.data?.results || [];

    if (buildings.length === 0) return [];

    // Gọi API income-statistics cho tất cả building
    const results = await Promise.all(
        buildings.map((building: any) =>
            sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings/${building._id}/water-statistics`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                nextOption: {
                    next: { tags: ["list-income-statistics"] },
                },
            }).then(res => ({
                buildingId: building._id,
                buildingName: building.name,
                incomeData: res.data || []
            }))
        )
    );

    return results;
};

export const fetchElectricityStatistics = async () => {
    const session = await auth();
    const resBuilding = await handleBuildingUser();
    const buildings = resBuilding.data?.results || [];

    if (buildings.length === 0) return [];

    const results = await Promise.all(
        buildings.map((building: any) =>
            sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings/${building._id}/electricity-statistics`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                nextOption: {
                    next: { tags: ["list-income-statistics"] },
                },
            }).then(res => ({
                buildingId: building._id,
                buildingName: building.name,
                incomeData: res.data || []
            }))
        )
    );

    return results;
};



export const fetchVehiclesStatistics = async () => {
    const session = await auth();
    const resBuilding = await handleBuildingUser();
    const buildings = resBuilding.data?.results || [];

    if (buildings.length === 0) return [];

    const results = await Promise.all(
        buildings.map((building: any) =>
            sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings/${building._id}/vehicles-statistics`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                nextOption: {
                    next: { tags: ["list-income-statistics"] },
                },
            }).then(res => ({
                buildingId: building._id,
                buildingName: building.name,
                incomeData: res.data || []
            }))
        )
    );

    return results;
};