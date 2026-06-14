import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WaterBillsService } from './water_bills.service';
import { CreateWaterBillDto } from './dto/create-water_bill.dto';
import { UpdateWaterBillDto } from './dto/update-water_bill.dto';
import { Public } from 'src/decorator/customize';

@Controller('water-bills')
export class WaterBillsController {
  constructor(private readonly waterBillsService: WaterBillsService) { }

  @Post()
  @Public()
  create(@Body() createWaterBillDto: CreateWaterBillDto) {
    return this.waterBillsService.create(createWaterBillDto);
  }

  @Get()
  @Public()
  findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    return this.waterBillsService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.waterBillsService.findOne(+id);
  }

  @Patch()
  @Public()
  update(@Body() updateWaterBillDto: UpdateWaterBillDto) {
    return this.waterBillsService.update(updateWaterBillDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.waterBillsService.remove(id);
  }
}
