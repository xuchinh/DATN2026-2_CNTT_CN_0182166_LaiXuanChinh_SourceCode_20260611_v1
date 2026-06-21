import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.entity';
import { Building, BuildingSchema } from '../buildings/schemas/building.schemas';
import { WaterBill, WaterBillSchema } from '../water_bills/schemas/water_bill.schemas';
import { ElectricityBill, ElectricityBillSchema } from '../electricity_bills/schemas/electricity_bill.schemas';
import { Vehicle, VehicleSchema } from '../vehicles/schemas/vehicle.schemas';
@Module({
  imports: [MongooseModule.forFeature([
    { name: Room.name, schema: RoomSchema },
    { name: Building.name, schema: BuildingSchema },
    { name: WaterBill.name, schema: WaterBillSchema },
    { name: ElectricityBill.name, schema: ElectricityBillSchema },
    { name: Vehicle.name, schema: VehicleSchema },
  ])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule { }
