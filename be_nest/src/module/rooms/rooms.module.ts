import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.entity';
import { Building, BuildingSchema } from '../buildings/schemas/building.schemas';
@Module({
  imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }, { name: Building.name, schema: BuildingSchema },])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule { }
