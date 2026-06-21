import { Module } from '@nestjs/common';
import { WaterBillsService } from './water_bills.service';
import { WaterBillsController } from './water_bills.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WaterBill, WaterBillSchema } from './schemas/water_bill.schemas';
import { Room, RoomSchema } from '../rooms/schemas/room.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: WaterBill.name, schema: WaterBillSchema },
    { name: Room.name, schema: RoomSchema },
  ])],
  controllers: [WaterBillsController],
  providers: [WaterBillsService],
})
export class WaterBillsModule { }
