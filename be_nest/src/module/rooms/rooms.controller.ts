import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRentalRequestDto } from './dto/create-rental-request.dto';
import { DecideRentalRequestDto } from './dto/decide-rental-request.dto';
import { CancelRentalRequestDto } from './dto/cancel-rental-request.dto';
import { Public } from 'src/decorator/customize';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  // ── Yêu cầu thuê nhà ──
  // Đặt TRƯỚC route @Get(':id') để 'rental-requests' / 'my-rental-requests'
  // không bị bắt nhầm thành tham số :id.
  @Public()
  @Post('rental-requests')
  createRentalRequest(@Body() dto: CreateRentalRequestDto) {
    return this.roomsService.createRentalRequest(dto);
  }

  @Public()
  @Get('rental-requests')
  getRentalRequests(@Query('landlordId') landlordId: string) {
    return this.roomsService.getRentalRequests(landlordId);
  }

  @Public()
  @Get('my-rental-requests')
  getMyRentalRequests(@Query('userId') userId: string) {
    return this.roomsService.getMyRentalRequests(userId);
  }

  @Public()
  @Patch('rental-requests/decide')
  decideRentalRequest(@Body() dto: DecideRentalRequestDto) {
    return this.roomsService.decideRentalRequest(dto);
  }

  @Public()
  @Patch('rental-requests/cancel')
  cancelRentalRequest(@Body() dto: CancelRentalRequestDto) {
    return this.roomsService.cancelRentalRequest(dto);
  }

  @Post()
  @Public()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }
  @Public()
  @Get()
  findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,) {
    return this.roomsService.findAll(
      query, +current, +pageSize);
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }
  @Public()
  @Patch()
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(updateRoomDto);
  }
  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
