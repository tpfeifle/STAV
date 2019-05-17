import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Script } from '../../../shared/models/script-manager.model';
import { Cron } from '../../../shared/models/cron.model';

const cronRegex = '^(\\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\\*\\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\\*|([0-9]|1[0-9]|2[0-3])|\\*\\/([0-9]|1[0-9]|2[0-3])) (\\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\\*\\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\\*|([1-9]|1[0-2])|\\*\\/([1-9]|1[0-2])) (\\*|([0-6])|\\*\\/([0-6]))$';
const cronScriptsRegex = '^.+$'; // TODO write one ([0-9]+(\s|\s\|\s|\||\s\||\|\s))

@Component({
  selector: 'app-cron-create',
  templateUrl: './cron-create.component.html',
  styleUrls: ['./cron-create.component.scss']
})
export class CronCreateComponent implements OnInit {
  @Input() scripts: Script[];
  @Output() createCronEmitter = new EventEmitter();
  createCronForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.createCronForm = this.fb.group({
      title: ['', Validators.required],
      schedule: ['', Validators.compose([Validators.required, Validators.pattern(cronRegex)])],
      scripts: ['', Validators.compose([Validators.required, Validators.pattern(cronScriptsRegex)])]
    });
  }

  ngOnInit() {}

  createCron() {
    const cronScripts = [];
    const splitted = this.createCronForm.value.scripts.split('|');
    splitted.forEach((element: string) => {
      const scripts = element
        .split(' ')
        .filter(scriptId => scriptId !== '')
        .map(scriptId => this.scripts.find(script => script.id === Number(scriptId)))
        .filter(script => script); // TODO think if we should instead through a UI error/...
      cronScripts.push(scripts);
    });
    console.log(cronScripts);
    const cron = new Cron(null, this.createCronForm.value.title, this.createCronForm.value.schedule, cronScripts);
    console.log(cron);
    this.createCronEmitter.emit(cron);
    // this.createCronForm.reset();
  }
}
