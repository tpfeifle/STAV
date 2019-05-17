import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Parser } from '../../../shared/models/parser.model';
import { MatPaginator, MatSnackBar, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-parser-list',
  templateUrl: './parser-list.component.html',
  styleUrls: ['./parser-list.component.scss']
})
export class ParserListComponent implements OnChanges {
  @Input()
  parsers: Parser[];

  @Output()
  removeParserEmitter = new EventEmitter();

  @Output()
  clearParserDataEmitter = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  parsersDataSource: MatTableDataSource<Parser>;

  displayedColumns: string[] = ['id', 'name', 'topic', 'action'];
  constructor(private snackBar: MatSnackBar){}

  ngOnChanges() {
    this.parsersDataSource = new MatTableDataSource(this.parsers);
    this.parsersDataSource.paginator = this.paginator;
  }
  remove(parser: Parser) {
    this.removeParserEmitter.emit(parser);
  }
  clearData(parser: Parser) {
    this.clearParserDataEmitter.emit(parser);
    this.snackBar.open('Cleared data for parser', null, {duration: 2000});
  }
}
