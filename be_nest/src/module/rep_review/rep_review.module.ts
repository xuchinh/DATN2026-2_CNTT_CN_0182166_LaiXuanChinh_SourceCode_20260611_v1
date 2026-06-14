import { Module } from '@nestjs/common';
import { RepReviewService } from './rep_review.service';
import { RepReviewController } from './rep_review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RepReview, RepReviewSchema } from './schemas/rep_review.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: RepReview.name, schema: RepReviewSchema }])],
  controllers: [RepReviewController],
  providers: [RepReviewService],
})
export class RepReviewModule { }
