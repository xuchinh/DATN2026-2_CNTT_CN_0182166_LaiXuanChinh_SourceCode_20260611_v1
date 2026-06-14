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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
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
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      results //kết quả query
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async update(updateUserDto: UpdateUserDto) {
    const { fromDate, totalMonth } = updateUserDto;

    const updatedData: any = { ...updateUserDto };
    if (fromDate && totalMonth) {
      updatedData.toDate = moment(fromDate).add(Number(totalMonth), 'months').toDate();
    }
    return await this.userModel.updateOne(
      { _id: updateUserDto._id }, updatedData);
  }

  async remove(_id: string) {
    //check id
    if (mongoose.isValidObjectId(_id)) {
      return this.userModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("_id không đúng định dạng")
    }
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
