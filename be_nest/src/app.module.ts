import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './module/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './module/blogs/blogs.module';
import { BuildingsModule } from './module/buildings/buildings.module';
import { ElectricityBillsModule } from './module/electricity_bills/electricity_bills.module';
import { FeaturesModule } from './module/features/features.module';
import { OffersModule } from './module/offers/offers.module';
import { PackagesModule } from './module/packages/packages.module';
import { ReviewsModule } from './module/reviews/reviews.module';
import { RoomsModule } from './module/rooms/rooms.module';
import { VehiclesModule } from './module/vehicles/vehicles.module';
import { WaterBillsModule } from './module/water_bills/water_bills.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TransformInterceptor } from './core/transform.interceptor';
import { RepReviewModule } from './module/rep_review/rep_review.module';


@Module({
  imports: [
    UsersModule,
    BlogsModule,
    BuildingsModule,
    ElectricityBillsModule,
    FeaturesModule,
    OffersModule,
    PackagesModule,
    ReviewsModule,
    RoomsModule,
    VehiclesModule,
    WaterBillsModule,
    RepReviewModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    }
  ]
})

export class AppModule { }
