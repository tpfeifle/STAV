import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Script } from './script.entity';
import { Cron } from '../cron/cron.entity';

@Entity()
export class ScriptRun {
  constructor(
    id: number,
    script: Script,
    timestamp: Date,
    status: string,
    error: string,
    pid: number,
    cron: Cron,
  ) {
    this.id = id;
    this.script = script;
    this.timestamp = timestamp;
    this.status = status;
    this.error = error;
    this.pid = pid;
    this.cron = cron;
  }

  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @ManyToOne(type => Script, script => script.history, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  script: Script;

  @ApiModelProperty()
  @Column()
  timestamp: Date;

  @ApiModelProperty()
  @Column()
  status: string;

  @ApiModelProperty()
  @Column()
  error: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  pid: number;

  @ApiModelProperty()
  @ManyToOne(type => Cron, cron => cron.scriptRuns, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  cron: Cron;
}
