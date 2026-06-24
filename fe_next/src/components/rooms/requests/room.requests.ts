'use server'
import { auth } from "@/auth";
import { sendRequest } from "../../../utils/api";
import { revalidateTag } from "next/cache";
import dayjs from "dayjs";

export const handleRoom = async (searchParams: { [key: string]: any }) => {
    const session = await auth();
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const status = searchParams?.status;
    const statusPayment = searchParams?.statusPayment;
    const searchBuildingId = searchParams?.buildingId;
    const search = searchParams?.search;
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
                status,
                search,
                statusPayment,
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
                        current: 1,
                        pageSize,
                        status,
                        search,
                        statusPayment,
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
export const handleCreateRoom = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    });

    if (res?.data?.buildingId) {
        await handleUpdateIncome(res.data.buildingId);
    }

    revalidateTag("list-rooms");
    return res;
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
export const handleConfirmRoom = async (id: string, status: boolean, buildingId: string) => {
    const session = await auth();

    const body = status
        ? { _id: id, status: true }
        : {
            _id: id,
            status: false,
            userId: null,
            fromDate: null,
            toDate: null,
            totalMonth: "0",
            // [Câu 8] forceExpire=true: landlord chủ động xác nhận → bỏ qua server-side race guard
            forceExpire: true,
        };

    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body
    });

    // Khi chủ trọ XÁC NHẬN khách thuê (status=true): tự sinh hóa đơn điện/nước cho phòng.
    // Phải gọi sau khi PATCH status=true vì backend chặn tạo hóa đơn cho phòng đang trống.
    if (status) {
        await handleCreateWaterBill(id);
        await handleCreateElectricityBill(id);
    }

    // Khi phòng hết hạn, vẫn cần cập nhật income từ paymentHistory và revalidate chart
    // Income vẫn đúng vì paymentHistory không bị xóa
    if (buildingId) {
        await handleUpdateIncome(buildingId);
    }
    revalidateTag("list-rooms");
    return res;
};

export const handleDeleteRoom = async (id: string, buildingId: string) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    });

    await handleUpdateIncome(buildingId);
    revalidateTag("list-rooms");
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
export const handleUser = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-users"] },
        },
    });
};

export const handleCreateWaterBill = async (id: string) => {
    const session = await auth();
    const fromDate = new Date()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/water-bills`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        // Hóa đơn mới khi xác nhận thuê: số nước + giá nước + thành tiền = 0 để chủ trọ tự chỉnh
        body: { roomId: id, fromDate: fromDate, toDate: fromDate, amount: '0', waterPrice: '0', payment: '0' }
    })
    revalidateTag("list-water-bills")
    return res;
}
export const handleCreateElectricityBill = async (id: string) => {
    const session = await auth();
    const fromDate = new Date()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/electricity-bills`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        // Hóa đơn mới khi xác nhận thuê: số điện + giá điện + thành tiền = 0 để chủ trọ tự chỉnh
        body: { roomId: id, fromDate: fromDate, toDate: fromDate, amount: '0', eletricPrice: '0', payment: '0' }
    })
    revalidateTag("list-electricity-bills")
    return res;
}

export const handleConfirmPaymen = async (id: string, statusPayment: string, buildingId: string) => {
    const session = await auth();
    // Ghi nhận ngày xác nhận thanh toán khi chủ trọ confirm (statusPayment = '3')
    const paymentsDate = statusPayment === '3' ? new Date() : undefined;
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { _id: id, statusPayment, ...(paymentsDate && { paymentsDate }) }
    });

    await handleUpdateIncome(buildingId);
    revalidateTag("list-rooms");
    return res;
};
export const handleConfirmPaymenNoupdateIncome = async (id: string, statusPayment: string) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { _id: id, statusPayment }
    });
    // Chart vẫn cần revalidate để hiển thị income đúng từ paymentHistory
    revalidateTag("list-income-statistics");
    revalidateTag("list-rooms");
    return res;
};

export const handleUpdateIncome = async (buildingId: string) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings/${buildingId}/income-update`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    });
    revalidateTag("list-buildings");
    revalidateTag("list-income-statistics"); // cập nhật biểu đồ doanh thu
    return res;
};

