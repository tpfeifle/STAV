export class SensorTableModel {
  name: string;
  fields: string[];
  data: any[][];
  id;

  constructor(id: number, name: string, fields: string[], data: any[][]) {
    this.id = id;
    this.name = name;
    this.fields = fields;
    this.data = data;
  }
}
