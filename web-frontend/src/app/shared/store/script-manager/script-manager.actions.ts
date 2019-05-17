import { Cron } from '../../models/cron.model';

export class GetScriptList {
  static readonly type = '[ScriptManager] Get script list';
  constructor() {}
}
export class GetScriptHistory {
  static readonly type = '[ScriptManager] Get script history';
  constructor() {}
}

export class CreateScript {
  static readonly type = '[ScriptManager] Create script';
  constructor(public formData: FormData) {}
}

export class RunScript {
  static readonly type = '[ScriptManager] Run script';
  constructor(public scriptId: number) {}
}

export class TerminateScript {
  static readonly type = '[ScriptManager] Terminate script';
  constructor(public scriptRunId: number) {}
}

export class DeleteScript {
  static readonly type = '[ScriptManager] Delete script';
  constructor(public scriptId: number) {}
}

export class GetCronList {
  static readonly type = '[ScriptManager] Get cron list';
  constructor() {}
}

export class CreateCron {
  static readonly type = '[ScriptManager] Create cron';
  constructor(public cron: Cron) {}
}
export class DeleteCron {
  static readonly type = '[ScriptManager] Delete cron';
  constructor(public cronId: number) {}
}
