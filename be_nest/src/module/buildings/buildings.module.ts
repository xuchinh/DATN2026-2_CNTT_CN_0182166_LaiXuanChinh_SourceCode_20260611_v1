import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Building, BuildingSchema } from './schemas/building.schemas';
import { Package, PackageSchema } from '../packages/schemas/package.schemas';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { Room, RoomSchema } from '../rooms/schemas/room.entity';
import { WaterBill, WaterBillSchema } from '../water_bills/schemas/water_bill.schemas';
import { ElectricityBill, ElectricityBillSchema } from '../electricity_bills/schemas/electricity_bill.schemas';
import { Vehicle, VehicleSchema } from '../vehicles/schemas/vehicle.schemas';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Building.name, schema: BuildingSchema },
      { name: Package.name, schema: PackageSchema },
      { name: User.name, schema: UserSchema },
      { name: Room.name, schema: RoomSchema },
      { name: WaterBill.name, schema: WaterBillSchema },
      { name: ElectricityBill.name, schema: ElectricityBillSchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
    UsersModule,
  ],
  controllers: [BuildingsController],
  providers: [BuildingsService],
})
export class BuildingsModule { }
