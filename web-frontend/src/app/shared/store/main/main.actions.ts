export class GetSheetList {
  static readonly type = '[Main] GetSheetList';
  constructor() {}
}

export class CreateSheet {
  static readonly type = '[Main] CreateSheet';
  constructor(public name: string) {}
}

export class DeleteSheet {
  static readonly type = '[Sheet] DeleteSheet';
  constructor(public sheetId: number) {}
}

export class SetProject {
  static readonly type = '[Main] SetProject';
  constructor(public project: number) {}
}
