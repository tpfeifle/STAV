import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { CronPriority } from './cron-priority.entity';
import { ScriptRun } from '../script-manager/script-run.entity';
import { Project } from '../project/project.entity';

@Entity()
export class Cron {
  constructor(
    id: number,
    title: string,
    schedule: string,
    priorities: CronPriority[],
    owner: Project,
  ) {
    this.id = id;
    this.title = title;
    this.schedule = schedule;
    this.priorities = priorities;
    this.owner = owner;
  }

  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column()
  title: string;

  @ApiModelProperty()
  @Column()
  schedule: string;

  @ApiModelProperty()
  @OneToMany(type => CronPriority, (priority: CronPriority) => priority.cron, {
    eager: true,
  })
  priorities: CronPriority[];

  @ApiModelProperty()
  @OneToMany(type => ScriptRun, scriptRun => scriptRun.cron)
  scriptRuns: ScriptRun[];

  @ManyToOne(type => Project, { onDelete: 'CASCADE', cascade: true })
  owner: Project;
}
