import {
  Body,
  Controller,
  Delete,
  FileFieldsInterceptor,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Parser } from './parser.entity';
import { ParserManagerService } from './parser-manager.service';
import { ProjectService } from '../project/project.service';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('ParserManager')
@Controller('project/:projectId/parser-manager')
export class ParserManagerController {
  constructor(
    private readonly parserManagerService: ParserManagerService,
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'fileParser' }, { name: 'filePipRequirements', maxCount: 1 }]),
  )
  async create(
    @UploadedFiles() files,
    @Body() parser: Parser,
    @Param('projectId') projectId: number,
  ): Promise<Parser> {
    console.log(files);
    const owner = await this.projectService.findOne(projectId);
    const parserFiles = files.fileParser;
    const filePipRequirements = files.filePipRequirements ? files.filePipRequirements[0] : null;

    const newParser = new Parser(null, parser.name, parser.topic, owner);
    return await this.parserManagerService.create(newParser, parserFiles, filePipRequirements);
  }

  @Get()
  async getAll(@Param('projectId') projectId: number): Promise<Parser[]> {
    const owner = await this.projectService.findOne(projectId);
    return await this.parserManagerService.findAll(owner);
  }

  @Delete(':parserId')
  async remove(@Param('parserId') parserId: number) {
    return await this.parserManagerService.remove(parserId);
  }

  @Get(':parserId/clear')
  async clear(@Param('parserId') parserId: number) {
    return await this.parserManagerService.clearParser(parserId);
  }
}
