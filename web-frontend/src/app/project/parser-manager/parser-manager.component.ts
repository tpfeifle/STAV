import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ParserState } from '../../shared/store/parser/parser.state';
import { Observable } from 'rxjs';
import { Parser } from '../../shared/models/parser.model';
import { ClearParserData, CreateParser, DeleteParser, GetParserList } from '../../shared/store/parser/parser.actions';

@Component({
  selector: 'app-parser-manager',
  templateUrl: './parser-manager.component.html',
  styleUrls: ['./parser-manager.component.scss']
})
export class ParserManagerComponent implements OnInit {
  @Select(ParserState.parsers)
  parsers$: Observable<Parser[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetParserList());
  }

  create(formData: FormData) {
    console.log(formData);
    this.store.dispatch(new CreateParser(formData));
  }

  remove(parser: Parser) {
    this.store.dispatch(new DeleteParser(parser.id));
  }

  clearData(parser: Parser) {
    this.store.dispatch(new ClearParserData(parser.id));
  }
}
