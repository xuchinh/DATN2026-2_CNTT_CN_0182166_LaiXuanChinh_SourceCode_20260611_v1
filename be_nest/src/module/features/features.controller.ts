import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { Public } from 'src/decorator/customize';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) { }

  @Post()
  @Public()
  create(@Body() createFeatureDto: CreateFeatureDto) {
    return this.featuresService.create(createFeatureDto);
  }

  @Get()
  @Public()
  findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    return this.featuresService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featuresService.findOne(+id);
  }

  @Patch()
  @Public()
  update(@Body() updateFeatureDto: UpdateFeatureDto) {
    return this.featuresService.update(updateFeatureDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.featuresService.remove(id);
  }
}
