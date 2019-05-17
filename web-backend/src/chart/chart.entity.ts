import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Sheet } from '../sheet/sheet.entity';
import { ChartParameter } from './chart-parameter.entity';

@Entity()
export class Chart {
  constructor(
    id: number,
    sheet: Sheet,
    chartTemplateId: number,
    width: number,
    height: number,
    parameters: ChartParameter[],
    sensorTable: string,
    query: string,
  ) {
    this.id = id;
    this.sheet = sheet;
    this.chartTemplateId = chartTemplateId;
    this.width = width;
    this.height = height;
    this.parameters = parameters;
    this.sensorTable = sensorTable;
    this.query = query;
  }

  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @ManyToOne(type => Sheet, sheet => sheet.charts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sheet: Sheet;

  @ApiModelProperty()
  @Column()
  chartTemplateId: number;

  @Column({
    default: 1,
  })
  width: number;

  @Column({
    default: 1,
  })
  height: number;

  @ApiModelProperty()
  @OneToMany(
    () => ChartParameter,
    (chartParameter: ChartParameter) => chartParameter.chartId,
    { eager: true },
  )
  parameters: ChartParameter[];

  @ApiModelProperty()
  @Column()
  sensorTable: string; // TODO: use some form of id to reference

  @ApiModelProperty()
  @Column('text')
  query: string;
}
