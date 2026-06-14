export type TypeBuildingProp = {
    _id: string;
    name: string;
    address: string;
    priceOfRoom: number; // giá trung bình mỗi phòng
    totalRooms: number; // tổng số phòng
    numberOfRoomsRented: number; //Số phòng đã cho thuê
    numberOfPeopleRoom: number; //số người tối đã cho 1 phòng
    rating: number;
    income: string; //tổng thu nhập
    userId: string // id chủ nhà
};

export type TypeRoomProp = {
    _id: string;
    code: string;
    acreage: string;
    kitchen: boolean;
    toilet: boolean;
    washroom: boolean;
    totalPeople: string;
    price: string;
    totalMonth: string;
    payment: string
    status: boolean;
    userId: string;
    buildingId: string;
    fromDate: Date;
    toDate: Date;
    paymentsDate: Date
    statusPayment: boolean;
};
