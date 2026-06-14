import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Public } from 'src/decorator/customize';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }

  @Post()
  @Public()
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  @Public()
  findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    return this.offersService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }

  @Patch()
  @Public()
  update(@Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(updateOfferDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.offersService.remove(id);
  }
}
