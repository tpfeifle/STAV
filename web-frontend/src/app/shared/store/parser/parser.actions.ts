export class CreateParser {
  static readonly type = '[Parser] create parser';
  constructor(public formData: FormData) {}
}

export class GetParserList {
  static readonly type = '[Parser] get list';
  constructor() {}
}

export class DeleteParser {
  static readonly type = '[Parser] delete parser';
  constructor(public parserId: number) {}
}

export class ClearParserData {
  static readonly type = '[Parser] clear parser data';
  constructor(public parserId: number) {}
}

