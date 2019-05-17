import { Cron } from './cron.model';

export class Script {
  id: number;
  title: string;
  status: string;

  constructor(id: number, title: string, status: string) {
    this.id = id;
    this.title = title;
    this.status = status;
  }
}

export class ScriptRun {
  constructor(id: number, script: Script, timestamp: Date, status: string, error: string, pid: string, cron: Cron) {
    this.id = id;
    this.script = script;
    this.timestamp = timestamp;
    this.status = status;
    this.error = error;
    this.pid = pid;
    this.cron = cron;
  }

  id: number;
  script: Script;
  timestamp: Date;
  status: string;
  error: string;
  pid: string;
  cron: Cron;
}
