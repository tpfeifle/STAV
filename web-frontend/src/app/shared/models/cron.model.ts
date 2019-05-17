import { CronPriority } from './cron-priority.model';

export class Cron {
  constructor(id: number, title: string, schedule: string, priorities: CronPriority[]) {
    this.id = id;
    this.title = title;
    this.schedule = schedule;
    this.priorities = priorities;
  }
  id: number;
  title: string;
  schedule: string;
  priorities: CronPriority[];
}
