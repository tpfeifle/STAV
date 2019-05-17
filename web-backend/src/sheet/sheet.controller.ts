import {
  Controller,
  Get,
  Delete,
  Post,
  Param,
  Body,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SheetService } from './sheet.service';
import { Sheet } from './sheet.entity';
import { ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProjectService } from '../project/project.service';

@Controller('project/:projectId/sheet')
@ApiUseTags('Sheet')
export class SheetController {
  constructor(private readonly sheetService: SheetService, private readonly projectService: ProjectService) {}

  @Post()
  public async create(@Body() sheet: Sheet, @Param('projectId') projectId): Promise<Sheet> {
    const user = await this.projectService.findOne(projectId);
    return await this.sheetService.create(sheet, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Sheet> {
    return await this.sheetService.findOne(id);
  }

  @Get()
  async findAll(@Param('projectId') projectId: number): Promise<Sheet[]> {
    const user = await this.projectService.findOne(projectId);
    return await this.sheetService.findAll(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<Error> {
    return await this.sheetService.remove(id);
  }
}
