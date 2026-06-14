import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RepReviewService } from './rep_review.service';
import { CreateRepReviewDto } from './dto/create-rep_review.dto';
import { UpdateRepReviewDto } from './dto/update-rep_review.dto';

@Controller('rep-review')
export class RepReviewController {
  constructor(private readonly repReviewService: RepReviewService) { }

  @Post()
  create(@Body() createRepReviewDto: CreateRepReviewDto) {
    return this.repReviewService.create(createRepReviewDto);
  }

  @Get()
  findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    return this.repReviewService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repReviewService.findOne(+id);
  }

  @Patch()
  update(@Body() updateRepReviewDto: UpdateRepReviewDto) {
    return this.repReviewService.update(updateRepReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repReviewService.remove(id);
  }
}
