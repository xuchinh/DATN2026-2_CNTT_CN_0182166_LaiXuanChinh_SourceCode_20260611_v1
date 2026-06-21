import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schemas';
import { Room, RoomSchema } from '../rooms/schemas/room.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Vehicle.name, schema: VehicleSchema },
    { name: Room.name, schema: RoomSchema },
  ])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule { }
