import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-parser-create',
  templateUrl: './parser-create.component.html',
  styleUrls: ['./parser-create.component.scss']
})
export class ParserCreateComponent implements OnInit {
  @Output() createParserEmitter = new EventEmitter();
  createForm: FormGroup;
  parserFiles: Array<File>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      topic: ['', Validators.required],
      filePipRequirements: [''],
    });
  }

  createParser() {
    const fd = new FormData();
    console.log(this.parserFiles);
    for (let i = 0; i < this.parserFiles.length; i++) {
      fd.append('fileParser', this.parserFiles[i]);
    }
    fd.append('filePipRequirements', this.createForm.value.filePipRequirements);
    fd.append('name', this.createForm.value.name);
    fd.append('topic', this.createForm.value.topic);
    this.createParserEmitter.emit(fd);
    // this.createForm.reset();
  }

  onScriptFileChange(event) {
    if (event.target.files && event.target.files.length) {
      this.parserFiles = event.target.files;
    }
  }

  onPipRequirementFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const filePipRequirements = event.target.files.item(0);
      this.createForm.patchValue({
        filePipRequirements
      });
    }
  }
}
