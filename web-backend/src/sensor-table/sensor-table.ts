export interface SensorTableTemplate {
  name: string;
  fields: string[];
  id: number;
  data: any[][];
}

export class SensorTable {
  name: string;
  fields: string[];
  id: number;
  data: any[][];

  constructor(id: number, name: string, fields: string[], data: any[][]) {
    this.name = name;
    this.fields = fields;
    this.id = id;
    this.data = data;
  }
}
