import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordUtil } from 'src/util/hashPasswordUtil';
import aqp from 'api-query-params';
import { log } from 'console';
import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import moment from 'moment';
import { Room } from '../rooms/schemas/room.entity';
import { Building } from '../buildings/schemas/building.schemas';
import { WaterBill } from '../water_bills/schemas/water_bill.schemas';
import { ElectricityBill } from '../electricity_bills/schemas/electricity_bill.schemas';
import { Vehicle } from '../vehicles/schemas/vehicle.schemas';
import { Package } from '../packages/schemas/package.schemas';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
    @InjectModel(Building.name)
    private buildingModel: Model<Building>,
    @InjectModel(WaterBill.name)
    private waterBillModel: Model<WaterBill>,
    @InjectModel(ElectricityBill.name)
    private electricityBillModel: Model<ElectricityBill>,
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<Vehicle>,
    @InjectModel(Package.name)
    private packageModel: Model<Package>,
    private readonly mailerService: MailerService,
  ) { }
  //fun check mail exists
  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  }
  //fun check phone exists
  isPhoneExist = async (phone: string) => {
    const user = await this.userModel.exists({ phone });
    if (user) return true;
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, avatar } = createUserDto;
    // check email
    const isExistEmail = await this.isEmailExist(email);
    if (isExistEmail) {
      throw new BadRequestException(`Email đã tồn tại:${email}`)
    }
    // check phone
    const isExistPhone = await this.isPhoneExist(phone);
    if (isExistPhone) {
      throw new BadRequestException(`Số điện thoại đã tồn tại:${phone}`)
    }
    // hash password
    const hashPassword = await hashPasswordUtil(password)
    const user = await this.userModel.create({
      name, email, phone, password: hashPassword, address, avatar
    })
    return {
      _id: user._id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (filter.search) delete filter.search;

    if (query.search) {
      filter.$or = [
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }
    // Ẩn tài khoản đã soft-delete khỏi danh sách
    filter.isDeleted = { $ne: true };
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password")
      .sort(sort as any);

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số bản ghi
      },
      results //kết quả query
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    // Loại trừ tài khoản đã soft-delete → không cho đăng nhập
    return await this.userModel.findOne({ email, isDeleted: { $ne: true } })
  }

  async update(updateUserDto: UpdateUserDto) {
    const { fromDate, totalMonth, recordPackageRevenue, revenueAmount } = updateUserDto;

    const updatedData: any = { ...updateUserDto };
    // Loại bỏ các cờ tạm + _id để không ghi vào DB
    delete updatedData.recordPackageRevenue;
    delete updatedData.revenueAmount;
    delete updatedData._id;
    if (fromDate && totalMonth) {
      updatedData.toDate = moment(fromDate).add(Number(totalMonth), 'months').toDate();
    }

    // Ghi nhận doanh thu gói bất biến vào paymentHistory khi super admin xác nhận thanh toán.
    // packageId/packageCode lấy từ chính DTO (gói đang mua) → fallback về user hiện tại.
    if (recordPackageRevenue) {
      const user = await this.userModel.findById(updateUserDto._id).lean();
      const packageId = updateUserDto.packageId ?? user?.packageId;
      const pkg = packageId ? await this.packageModel.findById(packageId).lean() : null;
      const updateQuery: any = {
        $set: updatedData,
        $push: {
          paymentHistory: {
            date: new Date(),
            packageId: packageId ?? null,
            packageCode: pkg?.code ?? '',
            amount: Number(revenueAmount ?? 0),
          },
        },
      };
      return await this.userModel.updateOne({ _id: updateUserDto._id }, updateQuery);
    }

    return await this.userModel.updateOne(
      { _id: updateUserDto._id }, updatedData);
  }

  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException("_id không đúng định dạng");
    }

    // [Câu 1] Nếu user là landlord → cascade soft-delete toàn bộ buildings và nội dung của họ
    // (giữ lại toàn bộ dữ liệu để không mất lịch sử doanh thu)
    const buildings = await this.buildingModel.find({ userId: _id }).select('_id').lean();
    if (buildings.length > 0) {
      const buildingIds = buildings.map(b => b._id);
      const rooms = await this.roomModel.find({ buildingId: { $in: buildingIds } }).select('_id').lean();
      if (rooms.length > 0) {
        const roomIds = rooms.map(r => r._id);
        await this.waterBillModel.updateMany({ roomId: { $in: roomIds } }, { isDeleted: true });
        await this.electricityBillModel.updateMany({ roomId: { $in: roomIds } }, { isDeleted: true });
        await this.vehicleModel.updateMany({ roomId: { $in: roomIds } }, { isDeleted: true });
        await this.roomModel.updateMany({ _id: { $in: roomIds } }, { isDeleted: true });
      }
      await this.buildingModel.updateMany({ _id: { $in: buildingIds } }, { isDeleted: true });
    }

    // [Câu 1] Nếu user là tenant → trả phòng về trống, giữ paymentHistory để không mất lịch sử thu nhập
    await this.roomModel.updateMany(
      { userId: _id, status: true },
      {
        $set: { status: false, statusPayment: '1', totalMonth: '0' },
        $unset: { userId: 1, fromDate: 1, toDate: 1 },
      }
    );

    // Soft-delete tài khoản: ẩn khỏi danh sách + chặn đăng nhập (qua findByEmail), giữ lại bản ghi
    return this.userModel.updateOne({ _id }, { isDeleted: true });
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password, phone, address } = registerDto;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      if (existingUser.isActive) {
        throw new BadRequestException(`Email đã tồn tại:${email}`)
      }
      // Email tồn tại nhưng chưa kích hoạt → cập nhật thông tin và gửi lại mã mới
      const hashPassword = await hashPasswordUtil(password)
      const codeIdActive = uuidv4()
      await this.userModel.updateOne(
        { _id: existingUser._id },
        { name, phone, password: hashPassword, address, codeId: codeIdActive, codeExpired: dayjs().add(5, 'minutes') }
      )
      this.mailerService.sendMail({
        to: email,
        subject: 'Activate your account',
        template: 'register',
        context: { name: name ?? email, activationCode: codeIdActive }
      })
      return { _id: existingUser._id }
    }

    // Email chưa tồn tại → kiểm tra phone rồi tạo mới
    const isExistPhone = await this.isPhoneExist(phone);
    if (isExistPhone) {
      throw new BadRequestException(`Số điện thoại đã tồn tại:${phone}`)
    }
    const hashPassword = await hashPasswordUtil(password)
    const codeIdActive = uuidv4()
    const user = await this.userModel.create({
      name, email, phone, password: hashPassword, address, isActive: false, codeId: codeIdActive,
      codeExpired: dayjs().add(5, 'minutes')
    })
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account',
      template: 'register',
      context: { name: user?.name ?? user.email, activationCode: codeIdActive }
    })
    return { _id: user._id }
  }
  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code
    })
    if (!user) {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //valid => update user
      await this.userModel.updateOne({ _id: data._id }, {
        isActive: true
      })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }


  }

  async retryActive(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    if (user.isActive) {
      throw new BadRequestException("Tài khoản đã được kích hoạt")
    }

    //send Email
    const codeId = uuidv4();

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account at laixuanchinh@gmail.com', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user._id }
  }

  async retryPassword(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }


    //send Email
    const codeId = uuidv4();

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Change your password account at laixuanchinh@gmail.com', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user._id, email: user.email }
  }

  async changePassword(data: ChangePasswordAuthDto) {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException("Mật khẩu/xác nhận mật khẩu không chính xác.")
    }

    //check email
    const user = await this.userModel.findOne({ email: data.email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //valid => update password
      const newPassword = await hashPasswordUtil(data.password);
      await user.updateOne({ password: newPassword })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }

  }

}
