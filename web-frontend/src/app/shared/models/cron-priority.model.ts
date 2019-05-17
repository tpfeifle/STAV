import { Script } from './script-manager.model';

export class CronPriority {
  constructor(id: number, scripts: Script[]) {
    this.id = id;
    this.scripts = scripts;
  }

  id: number;
  scripts: Script[];
}
