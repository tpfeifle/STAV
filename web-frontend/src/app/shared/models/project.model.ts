export class ProjectStateModel {
  constructor(projects: Project[]) {
    this.projects = projects;
  }
  projects: Project[];
}

export class Project {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
  id: number;
  name: string;
}
