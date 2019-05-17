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
import { ScriptManagerService } from './script-manager.service';
import { Script } from './script.entity';
import { ApiUseTags } from '@nestjs/swagger';
import { ScriptRun } from './script-run.entity';
import { FileLogger } from '../logger/file-logger';
import { ProjectService } from '../project/project.service';

@ApiUseTags('ScriptManager')
@Controller('project/:projectId/script-manager')
export class ScriptManagerController {
  constructor(
    private readonly scriptService: ScriptManagerService,
    private readonly logger: FileLogger,
    private readonly projectService: ProjectService,
  ) {}

  @Get()
  async getScriptList(@Param('projectId') projectId: number): Promise<Script[]> {
    const project = await this.projectService.findOne(projectId);
    return await this.scriptService.getAll(project);
  }

  @Get('history')
  async getScriptHistory(@Param('projectId') projectId: number): Promise<ScriptRun[]> {
    const project = await this.projectService.findOne(projectId);
    return await this.scriptService.getHistory(project);
  }

  @Get(':id/run')
  async runScript(@Param('id') scriptId: number): Promise<void> {
    this.scriptService.executeScript(scriptId);
  }

  @Get(':id/code')
  async getCode(@Param('id') scriptId: number): Promise<string> {
    return await this.scriptService.getCode(scriptId);
  }

  @Get(':id/terminate')
  async terminateScript(@Param('id') scriptRunId: number): Promise<ScriptRun> {
    return await this.scriptService.terminateScript(scriptRunId);
  }

  @Delete(':id')
  async deleteScript(@Param('id') scriptId: number): Promise<Error> {
    return await this.scriptService.remove(scriptId);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileScript', maxCount: 1 },
      { name: 'filePipRequirements', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles() files,
    @Body() parameters: Script,
    @Param('projectId') projectId: number,
  ): Promise<Script> {
    const project = await this.projectService.findOne(projectId);
    this.logger.log(`Uploaded files for script`);

    const newScript = new Script(null, parameters.title, 'DEPLOY', project);
    const fileScript = files.fileScript[0];
    const filePipRequirements = files.filePipRequirements[0];
    return await this.scriptService.create(newScript, fileScript, filePipRequirements);
  }
}
