import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { Sheet } from './sheet.entity';
import { getConnection } from 'typeorm';
import { Project } from '../project/project.entity';

@Injectable()
export class SheetService {
  constructor(
    @InjectRepository(Sheet)
    private readonly sheetRepository: Repository<Sheet>,
  ) {}

  async findOne(sheetId: number): Promise<Sheet> {
    return await getRepository(Sheet)
      .createQueryBuilder('sheet')
      .where('sheet.id = :id', { id: sheetId })
      .leftJoinAndSelect('sheet.charts', 'charts')
      .leftJoinAndSelect('charts.parameters', 'parameters')
      .orderBy({
        'charts.id': 'ASC',
      })
      .getOne();
  }

  async findAll(owner: Project): Promise<Sheet[]> {
    return await this.sheetRepository.find({ owner });
  }

  async create(sheet: Sheet, user: Project): Promise<Sheet> {
    const newSheet = new Sheet(null, sheet.name, [], user);
    return await this.sheetRepository.save(newSheet);
  }

  async remove(sheetId: number): Promise<Error> {
    const res: DeleteResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Sheet)
      .where('id = :id', { id: sheetId })
      .execute();
    if (res.affected === 1) {
      return null;
    } else {
      return new Error('Failed to remove sheet from database');
    }
  }
}
