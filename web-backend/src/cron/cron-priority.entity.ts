import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Script } from '../script-manager/script.entity';
import { Cron } from './cron.entity';

@Entity()
export class CronPriority {
  constructor(id: number, scripts: Script[], cron: Cron) {
    this.id = id;
    this.scripts = scripts;
    this.cron = cron;
  }

  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @ManyToMany(() => Script, (script: Script) => script.cronPriority, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  scripts: Script[];

  @ApiModelProperty()
  @ManyToOne(type => Cron, (cron: Cron) => cron.priorities, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  cron: Cron;
}
