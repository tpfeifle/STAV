export class ParserStateModel {
  public parsers: Parser[];
}

export class Parser {
  constructor(id: number, name: string, topic: string) {
    this.id = id;
    this.name = name;
    this.topic = topic;
  }
  id: number;
  name: string;
  topic: string;
}
