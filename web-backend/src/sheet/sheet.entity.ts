import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Chart } from '../chart/chart.entity';
import { Project } from '../project/project.entity';

@Entity()
export class Sheet {
  constructor(id: number, name: string, charts: Chart[], owner: Project) {
    this.id = id;
    this.name = name;
    this.charts = charts;
    this.owner = owner;
  }

  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ length: 255 })
  name: string;

  @ApiModelProperty()
  @OneToMany(type => Chart, chart => chart.sheet)
  charts: Chart[];

  @ManyToOne(type => Project, { onDelete: 'CASCADE', cascade: true })
  owner: Project;
}
