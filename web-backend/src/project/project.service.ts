import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Project } from './project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Sheet } from '../sheet/sheet.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Sheet)
    private readonly sheetRepository: Repository<Sheet>,
  ) {}

  async create(project: Project): Promise<Project> {
    const newProject = new Project(null, project.name);
    const createdProject = await this.projectRepository.save(newProject);
    const defaultSheet = new Sheet(null, 'Sheet1', [], createdProject);
    await this.sheetRepository.save(defaultSheet);
    return createdProject;
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find();
  }

  async findOne(projectId: number): Promise<Project> {
    return await this.projectRepository.findOne(projectId);
  }

  async remove(projectId: number): Promise<Error> {
    const res: DeleteResult = await this.projectRepository.delete(projectId);
    if (res.affected === 1) {
      return null;
    } else {
      return new Error('Failed to remove project from database');
    }
  }
}
