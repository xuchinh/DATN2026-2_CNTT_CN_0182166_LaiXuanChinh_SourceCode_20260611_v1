import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRentalRequestDto } from './dto/create-rental-request.dto';
import { DecideRentalRequestDto } from './dto/decide-rental-request.dto';
import { CancelRentalRequestDto } from './dto/cancel-rental-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './schemas/room.entity';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import moment from 'moment';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { Building } from '../buildings/schemas/building.schemas';
import { WaterBill } from '../water_bills/schemas/water_bill.schemas';
import { ElectricityBill } from '../electricity_bills/schemas/electricity_bill.schemas';
import { Vehicle } from '../vehicles/schemas/vehicle.schemas';
import { User } from '../users/schemas/user.schema';
import { Blog } from '../blogs/schemas/blog.schemas';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Building.name) private buildingModel: Model<Building>,
    @InjectModel(WaterBill.name) private waterBillModel: Model<WaterBill>,
    @InjectModel(ElectricityBill.name) private electricityBillModel: Model<ElectricityBill>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private readonly mailerService: MailerService,
  ) { }

  async create(createRoomDto: CreateRoomDto) {
    const {
      code,
      acreage,
      kitchen,
      toilet,
      washroom,
      totalPeople,
      price,
      status,
      buildingId, statusPayment, payment, images } = createRoomDto;

    // const isRoomOfBuildingExist = await this.isRoomOfBuildingExist(code, buildingId);
    // if (isRoomOfBuildingExist) {
    //   throw new BadRequestException(`Phòng có mã ${code} đã tộn tại trong tòa nhà này`)
    // }
    const existingRoom = await this.roomModel.findOne({
      code,
      buildingId,
      isDeleted: { $ne: true }
    });


    if (existingRoom) {
      throw new BadRequestException(
        `Phòng với mã ${code} đã tồn tại trong nhà trọ này.`,
      );
    }

    const userBuilding = await this.buildingModel.findById(buildingId);
    if (!userBuilding) {
      throw new BadRequestException("Nhà trọ không tồn tại.");
    }
    // Đếm số lượng nhà hiện tại (bỏ qua phòng đã soft-delete để giải phóng chỗ)
    const roomCount = await this.roomModel.countDocuments({ buildingId, isDeleted: { $ne: true } });
    if (roomCount >= Number(userBuilding.totalRooms)) {
      throw new BadRequestException(
        `Số lượng Phòng của nhà này đã đạt tối đa: ${userBuilding.totalRooms}`
      );
    }
    const room = await this.roomModel.create({
      code,
      acreage,
      kitchen,
      toilet,
      washroom,
      totalPeople,
      price,
      status,
      buildingId,
      statusPayment, payment,
      images: images ?? [],
    })
    return {
      _id: room._id
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (filter.search) delete filter.search;
    // Ẩn phòng đã soft-delete khỏi danh sách
    filter.isDeleted = { $ne: true };

    if (query.search) {
      filter.$or = [
        { code: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.roomModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.roomModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      // .select("-password")
      .sort(sort as any);

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      results //kết quả query
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }


  async update(updateRoomDto: UpdateRoomDto) {
    const { _id, fromDate, totalMonth, price, userId, forceExpire } = updateRoomDto;

    // Mỗi khách chỉ được thuê 1 phòng tại một thời điểm.
    // Tính cả phòng đang chờ xác nhận (status false) — miễn là phòng còn gắn với khách và
    // hợp đồng CÒN HẠN (chưa có toDate = vừa thuê, hoặc toDate trong tương lai).
    // Chỉ cho thuê tiếp khi hợp đồng cũ đã hết hạn.
    if (userId) {
      const now = new Date();
      const existingRoom = await this.roomModel.findOne({
        userId,
        _id: { $ne: _id },
        isDeleted: { $ne: true },
        $or: [
          { toDate: { $exists: false } },
          { toDate: null },
          { toDate: { $gt: now } },
        ],
      });
      if (existingRoom) {
        throw new BadRequestException(
          `Bạn đang thuê phòng ${existingRoom.code} (hợp đồng còn hạn). Mỗi khách chỉ được thuê 1 phòng. Vui lòng đợi hết hạn hợp đồng rồi thuê tiếp.`
        );
      }
    }

    const setData: any = { ...updateRoomDto };
    delete setData.forceExpire; // không lưu forceExpire vào DB
    const unsetData: any = {};

    for (const key of Object.keys(setData)) {
      if (setData[key] === null) {
        unsetData[key] = 1;
        delete setData[key];
      }
    }

    // [Câu 8] Nếu đây là auto-expire (không có forceExpire), verify phòng thực sự đã hết hạn
    // tránh race condition khi checkAndUpdateExpiredRooms chạy sau khi landlord đã gán khách mới
    if (setData.status === false && !forceExpire) {
      const currentRoom = await this.roomModel.findById(_id).select('status toDate').lean();
      if (currentRoom?.status === true && currentRoom?.toDate) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        if (new Date(currentRoom.toDate) >= todayStart) {
          throw new BadRequestException(
            "Phòng chưa hết hạn. Có thể khách mới vừa được gán vào phòng này. Vui lòng tải lại trang."
          );
        }
      }
    }

    if (fromDate && totalMonth) {
      setData.toDate = moment(fromDate).add(Number(totalMonth), 'months').toDate();
    }

    if (price && totalMonth) {
      setData.payment = Number(totalMonth) * Number(price);
    }

    const updateQuery: any = { $set: setData };
    if (Object.keys(unsetData).length > 0) {
      updateQuery.$unset = unsetData;
    }

    /*Thu nhập là nhật ký chỉ cộng khi xác nhận thanh toán, không bao giờ trừ.
      Chống trùng theo KHÁCH + THÁNG → cùng khách xác nhận lại trong tháng không bị cộng 2 lần,
      nhưng khách MỚI trong cùng phòng/tháng vẫn được cộng dồn */
    if (updateRoomDto.paymentsDate) {
      const room = await this.roomModel.findById(_id).lean();
      const startOfMonth = dayjs().startOf('month').toDate();
      const currentUserId = room?.userId ? String(room.userId) : null;
      const alreadyPaidThisMonth = room?.paymentHistory?.some(entry => {
        if (new Date(entry.date) < startOfMonth) return false;
        const entryUserId = entry.userId ? String(entry.userId) : null;
        return entryUserId === currentUserId;
      });
      if (!alreadyPaidThisMonth) {
        updateQuery.$push = {
          paymentHistory: {
            date: updateRoomDto.paymentsDate,
            price: room?.price || '0',
            userId: room?.userId ?? null,
          },
        };
      }
    }

    const result = await this.roomModel.updateOne({ _id }, updateQuery);

    // Khi phòng được xác nhận cho thuê (status=true): gắn các phương tiện mà khách đã nhập sẵn
    // (chưa gắn phòng nào) vào phòng này → chủ trọ nhìn thấy trong dashboard quản lý phương tiện.
    if (setData.status === true) {
      const room = await this.roomModel.findById(_id).select('userId buildingId').lean();
      if (room?.userId) {
        const building = await this.buildingModel.findById(room.buildingId).select('shippingPrice').lean();
        await this.vehicleModel.updateMany(
          {
            userId: room.userId,
            isDeleted: { $ne: true },
            $or: [{ roomId: { $exists: false } }, { roomId: null }],
          },
          {
            roomId: _id,
            ...(building?.shippingPrice ? { shippingPrice: building.shippingPrice } : {}),
          }
        );
      }
    }

    // Khi phòng hết hạn thuê (status=false): soft-delete xe + hóa đơn điện/nước của phòng này.
    // → Gỡ khỏi danh sách quản lý của chủ trọ để khi có khách thuê lại (kể cả khách cũ),
    //   hóa đơn điện/nước được sinh MỚI từ 0 (không bị chặn trùng tháng, không hiện lại hóa đơn cũ).
    // → Vẫn giữ income history vì thống kê doanh thu chỉ lọc theo status '3' (không lọc isDeleted),
    //   nên hóa đơn/xe đã xác nhận vẫn được tính vào biểu đồ doanh thu.
    if (setData.status === false) {
      await this.vehicleModel.updateMany({ roomId: _id }, { isDeleted: true });
      await this.electricityBillModel.updateMany({ roomId: _id }, { isDeleted: true });
      await this.waterBillModel.updateMany({ roomId: _id }, { isDeleted: true });
    }

    return result;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // YÊU CẦU THUÊ NHÀ (rental requests)
  // Khách bấm "Liên hệ thuê nhà" → tạo yêu cầu (KHÔNG gán phòng) → chủ trọ duyệt/từ chối.
  // ─────────────────────────────────────────────────────────────────────────

  // Khách (đã đăng nhập) gửi yêu cầu thuê. Không chặn theo "mỗi khách 1 phòng" ở bước này
  // (đúng tinh thần: ai cũng được liên hệ thoải mái). Ràng buộc đó áp dụng lúc chủ trọ DUYỆT.
  async createRentalRequest(dto: CreateRentalRequestDto) {
    const { roomId, userId, message, desiredFromDate, desiredMonths } = dto;

    // Chỉ người thuê (role USERS) mới được gửi yêu cầu thuê.
    // Chủ trọ (ADMIN) / quản trị viên (SUPER ADMIN) bị chặn.
    const requester = await this.userModel.findById(userId).lean();
    if (requester?.role && requester.role !== 'USERS') {
      throw new BadRequestException(
        "Tài khoản chủ trọ/quản trị viên không thể gửi yêu cầu thuê nhà.",
      );
    }

    const room = await this.roomModel.findById(roomId);
    if (!room || room.isDeleted) {
      throw new BadRequestException("Phòng không tồn tại.");
    }
    if (room.status === true) {
      throw new BadRequestException("Phòng này đã có người thuê.");
    }

    // Chặn gửi trùng: cùng khách đã có 1 yêu cầu đang chờ ở chính phòng này.
    const hasPending = (room.rentalRequests || []).some(
      (r) => String(r.userId) === String(userId) && r.status === 'pending',
    );
    if (hasPending) {
      throw new BadRequestException(
        "Bạn đã gửi yêu cầu thuê phòng này và đang chờ chủ trọ phản hồi.",
      );
    }

    room.rentalRequests.push({
      userId: userId as any,
      message,
      desiredFromDate,
      desiredMonths,
      status: 'pending',
      createdAt: new Date(),
    } as any);
    await room.save();

    // Gửi email cho chủ trọ (không chặn luồng nếu mail lỗi).
    const building = await this.buildingModel.findById(room.buildingId).lean();
    const landlord = building?.userId
      ? await this.userModel.findById(building.userId).lean()
      : null;
    if (landlord?.email) {
      this.mailerService.sendMail({
        to: landlord.email,
        subject: 'Có yêu cầu thuê phòng mới - RoomHub',
        template: 'rental-request-new',
        context: {
          landlordName: landlord.name ?? landlord.email,
          roomCode: room.code ?? '',
          buildingName: building?.name ?? '',
          requesterName: requester?.name ?? 'Khách',
          requesterPhone: requester?.phone ?? '—',
          requesterEmail: requester?.email ?? '—',
          message: message || '(không có lời nhắn)',
          desiredMonths: desiredMonths || '—',
        },
      }).catch((err) => console.error('Gửi mail yêu cầu thuê thất bại:', err?.message));
    }

    return { success: true };
  }

  // Chủ trọ xem danh sách yêu cầu thuê đang chờ trong tất cả nhà trọ của mình.
  async getRentalRequests(landlordId: string) {
    if (!mongoose.isValidObjectId(landlordId)) {
      throw new BadRequestException("landlordId không hợp lệ");
    }
    const buildings = await this.buildingModel
      .find({ userId: landlordId, isDeleted: { $ne: true } })
      .select('_id name')
      .lean();
    const buildingMap = new Map(buildings.map((b) => [String(b._id), b.name]));
    const buildingIds = buildings.map((b) => b._id);

    const rooms = await this.roomModel
      .find({
        buildingId: { $in: buildingIds },
        isDeleted: { $ne: true },
        'rentalRequests.status': 'pending',
      })
      .lean();

    // Gom userId để lấy info khách 1 lần.
    const userIds = new Set<string>();
    for (const room of rooms) {
      for (const r of room.rentalRequests || []) {
        if (r.status === 'pending') userIds.add(String(r.userId));
      }
    }
    const users = await this.userModel
      .find({ _id: { $in: Array.from(userIds) } })
      .select('name phone email avatar')
      .lean();
    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const results: any[] = [];
    for (const room of rooms) {
      for (const r of room.rentalRequests || []) {
        if (r.status !== 'pending') continue;
        const u = userMap.get(String(r.userId));
        results.push({
          roomId: room._id,
          roomCode: room.code,
          buildingId: room.buildingId,
          buildingName: buildingMap.get(String(room.buildingId)) ?? '',
          userId: r.userId,
          requesterName: u?.name ?? 'Khách',
          requesterPhone: u?.phone ?? '',
          requesterEmail: u?.email ?? '',
          message: r.message ?? '',
          desiredFromDate: r.desiredFromDate ?? null,
          desiredMonths: r.desiredMonths ?? '',
          createdAt: r.createdAt,
        });
      }
    }
    results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return { results };
  }

  // Khách xem trạng thái các yêu cầu thuê của chính mình — kèm địa chỉ nhà, bài blog
  // và thông tin liên hệ chủ trọ (để 2 bên chủ động trao đổi).
  async getMyRentalRequests(userId: string) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new BadRequestException("userId không hợp lệ");
    }
    const rooms = await this.roomModel
      .find({ 'rentalRequests.userId': userId, isDeleted: { $ne: true } })
      .select('code buildingId rentalRequests')
      .lean();

    const buildingIds = rooms.map((r) => r.buildingId);
    const buildings = await this.buildingModel
      .find({ _id: { $in: buildingIds } })
      .select('name address userId')
      .lean();
    const buildingMap = new Map(buildings.map((b) => [String(b._id), b]));

    // Thông tin liên hệ chủ trọ (chủ của từng nhà trọ).
    const landlordIds = buildings.map((b) => b.userId).filter(Boolean);
    const landlords = await this.userModel
      .find({ _id: { $in: landlordIds } })
      .select('name phone email bank bankAccount')
      .lean();
    const landlordMap = new Map(landlords.map((u) => [String(u._id), u]));

    // Bài blog giới thiệu của từng nhà trọ (nếu có).
    const blogs = await this.blogModel
      .find({ buildingId: { $in: buildingIds }, isDeleted: { $ne: true } })
      .select('buildingId title')
      .lean();
    const blogMap = new Map(blogs.map((b) => [String(b.buildingId), b]));

    const results: any[] = [];
    for (const room of rooms) {
      const b = buildingMap.get(String(room.buildingId));
      const landlord = b?.userId ? landlordMap.get(String(b.userId)) : null;
      const blog = blogMap.get(String(room.buildingId));
      for (const r of room.rentalRequests || []) {
        if (String(r.userId) !== String(userId)) continue;
        results.push({
          roomId: room._id,
          roomCode: room.code,
          buildingId: room.buildingId,
          buildingName: b?.name ?? '',
          buildingAddress: b?.address ?? '',
          blogId: blog?._id ?? null,
          blogTitle: blog?.title ?? '',
          landlordName: landlord?.name ?? '',
          landlordPhone: landlord?.phone ?? '',
          landlordEmail: landlord?.email ?? '',
          landlordBank: landlord?.bank ?? '',
          landlordBankAccount: landlord?.bankAccount ?? '',
          status: r.status,
          message: r.message ?? '',
          desiredMonths: r.desiredMonths ?? '',
          createdAt: r.createdAt,
        });
      }
    }
    results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return { results };
  }

  // Khách tự xóa (hủy) yêu cầu thuê của mình ở 1 phòng → gỡ khỏi danh sách của khách
  // và khỏi dashboard chủ trọ. Không ảnh hưởng tới việc gán phòng (nếu đã được duyệt).
  async cancelRentalRequest(dto: CancelRentalRequestDto) {
    const { roomId, userId } = dto;
    const room = await this.roomModel.findById(roomId);
    if (!room || room.isDeleted) {
      throw new BadRequestException("Phòng không tồn tại.");
    }
    const exists = (room.rentalRequests || []).some(
      (r) => String(r.userId) === String(userId),
    );
    if (!exists) {
      throw new BadRequestException("Không tìm thấy yêu cầu của bạn ở phòng này.");
    }
    await this.roomModel.updateOne(
      { _id: roomId },
      { $pull: { rentalRequests: { userId } } } as any,
    );
    return { success: true };
  }

  // Chủ trọ duyệt / từ chối 1 yêu cầu.
  // - reject: chỉ đổi trạng thái yêu cầu sang 'rejected'.
  // - accept: gán phòng cho khách (giống luồng thuê cũ: userId + fromDate + totalMonth + toDate + statusPayment '2'),
  //   tự động từ chối các yêu cầu pending còn lại của phòng. Phòng vẫn status=false đến khi chủ trọ
  //   bấm "Xác nhận người thuê" (luồng cũ sinh hóa đơn / gắn xe) → không phá vỡ logic hiện có.
  async decideRentalRequest(dto: DecideRentalRequestDto) {
    const { roomId, requestUserId, decision, totalMonth, fromDate } = dto;

    const room = await this.roomModel.findById(roomId);
    if (!room || room.isDeleted) {
      throw new BadRequestException("Phòng không tồn tại.");
    }

    const reqEntry = (room.rentalRequests || []).find(
      (r) => String(r.userId) === String(requestUserId) && r.status === 'pending',
    );
    if (!reqEntry) {
      throw new BadRequestException("Yêu cầu thuê không tồn tại hoặc đã được xử lý.");
    }

    const requester = await this.userModel.findById(requestUserId).lean();
    const building = await this.buildingModel.findById(room.buildingId).lean();

    if (decision === 'reject') {
      reqEntry.status = 'rejected';
      await room.save();
      this.sendDecisionMail(requester, room, building, 'rejected');
      return { success: true, decision: 'rejected' };
    }

    // ── decision === 'accept' ──
    // Phòng đã có người thuê thì không duyệt thêm.
    if (room.status === true) {
      throw new BadRequestException("Phòng này đã có người thuê. Không thể duyệt thêm.");
    }

    // Ràng buộc "mỗi khách chỉ thuê 1 phòng còn hạn" — áp dụng đúng lúc duyệt.
    const now = new Date();
    const existingRoom = await this.roomModel.findOne({
      userId: requestUserId,
      _id: { $ne: roomId },
      isDeleted: { $ne: true },
      $or: [
        { toDate: { $exists: false } },
        { toDate: null },
        { toDate: { $gt: now } },
      ],
    });
    if (existingRoom) {
      throw new BadRequestException(
        `Khách này đang thuê phòng ${existingRoom.code} (hợp đồng còn hạn). Mỗi khách chỉ được thuê 1 phòng.`,
      );
    }

    // Gán phòng cho khách (giống luồng thuê cũ).
    const startDate = fromDate
      ? new Date(fromDate)
      : reqEntry.desiredFromDate
        ? new Date(reqEntry.desiredFromDate)
        : new Date();
    const months = totalMonth ?? reqEntry.desiredMonths ?? '1';
    room.userId = requestUserId as any;
    room.fromDate = startDate;
    room.totalMonth = months;
    room.toDate = moment(startDate).add(Number(months), 'months').toDate();
    room.statusPayment = '2';

    // accepted cho khách này, tự động reject các yêu cầu pending còn lại của phòng.
    reqEntry.status = 'accepted';
    for (const r of room.rentalRequests) {
      if (String(r.userId) !== String(requestUserId) && r.status === 'pending') {
        r.status = 'rejected';
      }
    }
    await room.save();

    // Gán role USERS cho khách (giống handleUpdateUserAction ở luồng cũ).
    await this.userModel.updateOne({ _id: requestUserId }, { role: 'USERS' });

    // Khách đã được duyệt 1 phòng (mỗi khách chỉ thuê 1 phòng) → tự động GỠ các yêu cầu
    // đang chờ của khách này ở TẤT CẢ phòng khác, để không còn hiển thị trong dashboard
    // của các chủ trọ khác.
    await this.roomModel.updateMany(
      { _id: { $ne: roomId }, 'rentalRequests.userId': requestUserId },
      { $pull: { rentalRequests: { userId: requestUserId, status: 'pending' } } } as any,
    );

    this.sendDecisionMail(requester, room, building, 'accepted');
    return { success: true, decision: 'accepted' };
  }

  // Helper gửi mail kết quả duyệt/từ chối cho khách.
  private sendDecisionMail(
    requester: any,
    room: any,
    building: any,
    decision: 'accepted' | 'rejected',
  ) {
    if (!requester?.email) return;
    this.mailerService.sendMail({
      to: requester.email,
      subject:
        decision === 'accepted'
          ? 'Yêu cầu thuê phòng đã được chấp nhận - RoomHub'
          : 'Cập nhật yêu cầu thuê phòng - RoomHub',
      template: 'rental-request-decision',
      context: {
        requesterName: requester.name ?? requester.email,
        roomCode: room.code ?? '',
        buildingName: building?.name ?? '',
        accepted: decision === 'accepted',
      },
    }).catch((err) => console.error('Gửi mail quyết định thất bại:', err?.message));
  }

  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException("_id không đúng định dạng");
    }

    // Soft-delete: ẩn phòng nhưng giữ paymentHistory → doanh thu phòng không bị mất.
    // Vì không xóa cứng nữa nên không cần chặn phòng có lịch sử thanh toán.
    // Cascade soft-delete: hóa đơn điện/nước + xe → giữ toàn bộ lịch sử doanh thu.
    await this.waterBillModel.updateMany({ roomId: _id }, { isDeleted: true });
    await this.electricityBillModel.updateMany({ roomId: _id }, { isDeleted: true });
    await this.vehicleModel.updateMany({ roomId: _id }, { isDeleted: true });

    return this.roomModel.updateOne({ _id }, { isDeleted: true });
  }
}
