import { Module } from '@nestjs/common';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chart } from './chart.entity';
import { ChartParameter } from './chart-parameter.entity';
import { Sheet } from '../sheet/sheet.entity';
import { LoggerModule } from '../logger/LoggerModule';

@Module({
  imports: [TypeOrmModule.forFeature([Chart, ChartParameter, Sheet]), LoggerModule],
  controllers: [ChartController],
  providers: [ChartService],
})
export class ChartModule {}
