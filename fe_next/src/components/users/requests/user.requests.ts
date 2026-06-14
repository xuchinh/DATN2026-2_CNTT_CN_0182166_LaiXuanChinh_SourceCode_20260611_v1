'use server'
import { auth } from "@/auth";
import { sendRequest } from "../../../utils/api";
import { revalidateTag } from "next/cache";
import { handleUpdateIncome } from "@/components/rooms/requests/room.requests";
import dayjs from "dayjs";
import { handleVehicleById } from "@/components/vehicles/requests/vehicles.requests";

export const handleUserAction = async (searchParams: { [key: string]: any }) => {
    const session = await auth();
    const current = searchParams?.current ?? 1;
    const pageSize = searchParams?.pageSize ?? 10;
    const search = searchParams?.search;
    const status = searchParams?.status;
    const packageId = searchParams?.packageId;
    const userRes = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "GET",
        queryParams: { current, pageSize, search, status, packageId },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-users"] },
        },
    });

    const users = userRes?.data?.results ?? [];
    const buildingRes = await handleBuilfingUser();
    const buildings = buildingRes?.data?.results ?? [];
    const updatedUsers = await Promise.all(
        users.map(async (user: any) => {
            const userBuildings = buildings.filter(
                (building: any) => building.userId === user._id
            );
            const totalHouse = userBuildings.length.toString();
            await handleUpdateUserAction({
                _id: user._id,
                totalHouse,
            });

            return {
                ...user,
                totalHouse,
            };
        })
    );

    return {
        data: {
            results: updatedUsers,
            meta: userRes?.data?.meta,
        },
    };
};


export const handleCreateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users")
    return res;
}

export const handleUpdateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users")
    return res;
}

export const handleDeleteUserAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    })

    revalidateTag("list-users")
    return res;
}
export const handleUserLogin = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "GET",
        queryParams: { current, pageSize, _id: session?.user._id },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-users"] },
        },
    });
};

export const handleUserLoginv2 = async () => {
    const session = await auth();

    if (!session?.user?._id) {
        return null;
    }

    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "GET",
        queryParams: { current, pageSize, _id: session.user._id },
        headers: {
            Authorization: `Bearer ${session.user.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-users"] },
        },
    });
};

export const handleUserLoginv1 = async (roleUser: string) => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "GET",
        queryParams: { current, pageSize, role: roleUser },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-users"] },
        },
    });
};


export const handleBuilfingUser = async (id?: string) => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings`,
        method: "GET",
        queryParams: { current, pageSize, _id: id },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-buildings"] },
        },
    });
};

export const handlePackageUser = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 9999;


    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/packages`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-packages"] },
        },
    });
};

export const handlePackageUserLogin = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 9999;

    const resUser = await handleUserLogin();
    const user = resUser?.data?.results?.[0];

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/packages`,
        method: "GET",
        queryParams: { current, pageSize, _id: user.packageId },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-packages"] },
        },
    });
};


export const handleUserLoginStatus = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "GET",
        queryParams: { current, pageSize, _id: session?.user._id, status: true },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-users"] },
        },
    });
};
export const handleUserLoginId = async (id: string) => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "GET",
        queryParams: { current, pageSize, _id: id },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-users"] },
        },
    });
};

export const handleConfirmUpdateUserPayment = async (id: string) => {
    const session = await auth();
    const resUser = await handleUserLoginId(id);
    const user = resUser?.data?.results?.[0];
    if (!user) return { error: "User not found!" };

    const payment = Number(user.payment ?? 0);
    const paymentUpdate = Number(user.paymentUpdate ?? 0);
    const totalMonth = Number(user.totalMonth ?? 0);
    const totalMonthUpdate = Number(user.totalMonthUpdate ?? 0);

    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: {
            _id: id,
            payment: payment + paymentUpdate,
            toDate: user.toDateUpdate,
            totalMonth: totalMonth + totalMonthUpdate,
            statusPayment: true,
            paymentUpdate: null,
            totalMonthUpdate: null,
            toDateUpdate: null,
            statusPaymentUpdate: false,
        },
    });

    revalidateTag("list-users");
    return res;
};



export const handleRoom = async (Id?: string) => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
        method: "GET",
        queryParams: { current, pageSize, userId: Id },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-rooms"] },
        },
    });
};
export const handleConfirmPaymenRoomUser = async (id: string, statusPayment: string, buildingId: string) => {
    const session = await auth();
    const paymentsDate = new Date();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { _id: id, statusPayment, paymentsDate: paymentsDate }
    });

    await handleUpdateIncome(buildingId);
    revalidateTag("list-rooms");
    return res;
};

export const handleConfirmPackageUser = async (id: string, status: boolean) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { _id: id, status: status }
    });

    revalidateTag("list-users");
    return res;
};


export const handleWaterBill = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/water-bills`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-water-bills"] },
        },
    });
};

export const handleConfirmPaymenWaterBillUser = async (id: string, status: string) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/water-bills`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { _id: id, status: status }
    });
    revalidateTag("list-water-bills");
    return res;
};


export const handleElectricityBill = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/electricity-bills`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-electricity-bills"] },
        },
    });
};

export const handleConfirmPaymenElectricityBillUser = async (id: string, status: string) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/electricity-bills`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { _id: id, status: status }
    });
    revalidateTag("list-electricity-bills");
    return res;
};


export const handleVehicle = async () => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-vehicles"] },
        },
    });
};

export const handleCreaterVehicle = async (data: any) => {
    const session = await auth();
    const fromDate = new Date();
    const toDate = new Date(fromDate);
    toDate.setMonth(toDate.getMonth() + 1)
    const userResId = session?.user._id;
    const resRoom = await handleRoom(userResId)
    const resRoomId = resRoom?.data?.results?.[0] || [];

    const resBuilding = await handleBuilfingUser(resRoomId.buildingId)
    const resBuildingId = resBuilding?.data?.results?.[0] || [];

    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: {
            ...data,
            fromDate,
            toDate: toDate,
            shippingPrice: resBuildingId.shippingPrice,
            userId: userResId,
            roomId: resRoomId._id

        }
    });
    revalidateTag("list-vehicles");
    return res;
};

export const handleConfirmVehicle = async (id: string, status: string) => {
    const session = await auth();
    const resVehicle = await handleVehicleById(id)
    const newFromDate = resVehicle.data.results[0]?.toDate;

    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { _id: id, status: status, fromDate: newFromDate }
    })
    revalidateTag("list-vehicles")
    return res;
}

export const handleConfirmVehicleNotDay = async (id: string, status: string) => {
    const session = await auth();
    const resVehicle = await handleVehicleById(id)


    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { _id: id, status: status }
    })
    revalidateTag("list-vehicles")
    return res;
}

export const handleUserById = async (id: string) => {
    const session = await auth();
    const current = 1;
    const pageSize = 999999999;

    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "GET",
        queryParams: { current, pageSize, _id: id },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-users"] },
        },
    });
};
