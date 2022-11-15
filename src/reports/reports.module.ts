import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { Make } from './entities/make.entity';
import { Model } from './entities/model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Make, Model])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule { }
