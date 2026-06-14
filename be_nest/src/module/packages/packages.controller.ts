import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Public } from 'src/decorator/customize';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) { }

  @Post()
  @Public()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  @Public()
  findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,) {
    return this.packagesService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(+id);
  }

  @Patch()
  @Public()
  update(@Body() updatePackageDto: UpdatePackageDto) {
    return this.packagesService.update(updatePackageDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }
}
