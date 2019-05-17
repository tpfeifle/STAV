export class GetSensorTablesMetaData {
  static readonly type = '[SensorTables] GetMetaData';
  constructor() {}
}

export class GetSensorTableData {
  static readonly type = '[SensorTables] GetData';
  constructor(public scriptId: number) {}
}
