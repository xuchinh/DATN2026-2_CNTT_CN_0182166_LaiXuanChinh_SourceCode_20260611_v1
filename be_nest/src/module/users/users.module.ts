import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Room, RoomSchema } from '../rooms/schemas/room.entity';
import { Building, BuildingSchema } from '../buildings/schemas/building.schemas';
import { WaterBill, WaterBillSchema } from '../water_bills/schemas/water_bill.schemas';
import { ElectricityBill, ElectricityBillSchema } from '../electricity_bills/schemas/electricity_bill.schemas';
import { Vehicle, VehicleSchema } from '../vehicles/schemas/vehicle.schemas';
import { Package, PackageSchema } from '../packages/schemas/package.schemas';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Room.name, schema: RoomSchema },
    { name: Building.name, schema: BuildingSchema },
    { name: WaterBill.name, schema: WaterBillSchema },
    { name: ElectricityBill.name, schema: ElectricityBillSchema },
    { name: Vehicle.name, schema: VehicleSchema },
    { name: Package.name, schema: PackageSchema },
  ])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
