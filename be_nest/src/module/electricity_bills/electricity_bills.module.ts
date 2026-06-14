import { Module } from '@nestjs/common';
import { ElectricityBillsService } from './electricity_bills.service';
import { ElectricityBillsController } from './electricity_bills.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ElectricityBill, ElectricityBillSchema } from './schemas/electricity_bill.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: ElectricityBill.name, schema: ElectricityBillSchema }])],
  controllers: [ElectricityBillsController],
  providers: [ElectricityBillsService],
})
export class ElectricityBillsModule { }
