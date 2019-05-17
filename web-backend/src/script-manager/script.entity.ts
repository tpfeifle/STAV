import {
  Column,
  Entity,
  ManyToMany, ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { ScriptRun } from './script-run.entity';
import { CronPriority } from '../cron/cron-priority.entity';
import { Project } from '../project/project.entity';

@Entity()
export class Script {
  constructor(id: number, title: string, status: string, owner: Project) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.owner = owner;
  }

  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ unique: true })
  title: string;

  @ApiModelProperty()
  @Column()
  status: string;

  @ApiModelProperty()
  @OneToMany(type => ScriptRun, scriptRun => scriptRun.script)
  history: ScriptRun[];

  @ManyToMany(type => CronPriority, cronPriority => cronPriority.scripts)
  cronPriority: CronPriority[];

  @ManyToOne(type => Project, { onDelete: 'CASCADE', cascade: true })
  owner: Project;
}
