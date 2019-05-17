import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Chart } from './chart.entity';

@Entity()
export class ChartParameter {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @ManyToOne(type => Chart, chart => chart.parameters, {cascade: true, onDelete: 'CASCADE'})
  chartId: number; // TODO should be just chart instead of chartId

  @ApiModelProperty()
  @Column()
  templateParameter: string;

  @ApiModelProperty()
  @Column({nullable: true})
  assignedField: string;

  constructor(id: number, chartId: number, templateParameter: string, assignedField: string) {
    this.id = id;
    this.chartId = chartId;
    this.templateParameter = templateParameter;
    this.assignedField = assignedField;
  }
}
