import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-script-manager-create',
  templateUrl: './script-manager-create.component.html',
  styleUrls: ['./script-manager-create.component.scss']
})
export class ScriptManagerCreateComponent implements OnInit {
  @Output() createScriptEmitter = new EventEmitter();
  createForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      fileScript: ['', Validators.required],
      filePipRequirements: ['', Validators.required]
    });
  }

  createScript() {
    console.log(this.createForm.value.filePipRequirements);
    const fd = new FormData();
    fd.append('fileScript', this.createForm.value.fileScript);
    fd.append('filePipRequirements', this.createForm.value.filePipRequirements);
    fd.append('title', this.createForm.value.title);
    this.createScriptEmitter.emit(fd);
    // this.createForm.reset();
  }

  onScriptFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const fileScript = event.target.files.item(0);
      this.createForm.patchValue({
        fileScript
      });
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
