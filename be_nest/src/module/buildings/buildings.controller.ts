import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { Public } from 'src/decorator/customize';

@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) { }

  @Post()
  @Public()
  create(@Body() createBuildingDto: CreateBuildingDto) {
    return this.buildingsService.create(createBuildingDto);
  }

  @Get()
  @Public()
  findAll(
    @Query() query: any,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    return this.buildingsService.findAll(
      query, +current, +pageSize
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buildingsService.findOne(+id);
  }

  @Patch()
  @Public()
  update(@Param('id') id: string, @Body() updateBuildingDto: UpdateBuildingDto) {
    return this.buildingsService.update(updateBuildingDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.buildingsService.remove(id);
  }

  @Get(':id/income-update')
  async getIncomeStatistics(
    @Param('id') buildingId: string
  ) {
    return this.buildingsService.updateBuildingIncome(buildingId);
  }

  @Get(':id/income-statistics')
  async getMonthlyIncome(@Param('id') buildingId: string) {
    return this.buildingsService.getMonthlyIncomeStats(buildingId);
  }

  @Get(':id/water-statistics')
  async getWaterStats(@Param('id') buildingId: string) {
    return this.buildingsService.getWaterStats(buildingId);
  }
  @Get(':id/electricity-statistics')
  async getElectricityStats(@Param('id') buildingId: string) {
    return this.buildingsService.getElectricityStats(buildingId);
  }
  @Get(':id/vehicles-statistics')
  async getVehiclesStats(@Param('id') buildingId: string) {
    return this.buildingsService.getVehiclesStats(buildingId);
  }
}

