import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ElectricityBillsService } from './electricity_bills.service';
import { CreateElectricityBillDto } from './dto/create-electricity_bill.dto';
import { UpdateElectricityBillDto } from './dto/update-electricity_bill.dto';
import { Public } from 'src/decorator/customize';

@Controller('electricity-bills')
export class ElectricityBillsController {
  constructor(private readonly electricityBillsService: ElectricityBillsService) { }

  @Post()
  @Public()
  create(@Body() createElectricityBillDto: CreateElectricityBillDto) {
    return this.electricityBillsService.create(createElectricityBillDto);
  }
  @Public()
  @Get()
  findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    return this.electricityBillsService.findAll(
      query, +current, +pageSize
    );
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.electricityBillsService.findOne(+id);
  }
  @Public()
  @Patch()
  update(@Body() updateElectricityBillDto: UpdateElectricityBillDto) {
    return this.electricityBillsService.update(updateElectricityBillDto);
  }
  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.electricityBillsService.remove(id);
  }
}
