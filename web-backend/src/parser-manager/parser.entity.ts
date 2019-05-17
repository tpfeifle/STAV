import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Project } from '../project/project.entity';

@Entity()
export class Parser {
  constructor(id: number, name: string, topic: string, owner: Project) {
    this.id = id;
    this.name = name;
    this.topic = topic;
    this.owner = owner;
  }

  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @Column()
  topic: string;

  @ManyToOne(type => Project, { onDelete: 'CASCADE', cascade: true })
  owner: Project;
}
