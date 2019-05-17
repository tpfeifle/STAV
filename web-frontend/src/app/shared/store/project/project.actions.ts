import { Project } from '../../models/project.model';

export class CreateProject {
  static readonly type = '[Project] Create project';
  constructor(public project: Project) {}
}

export class DeleteProject {
  static readonly type = '[Project] Delete project';
  constructor(public projectId: number) {}
}

export class GetAllProjects {
  static readonly type = '[Project] Get all project';
  constructor() {}
}
