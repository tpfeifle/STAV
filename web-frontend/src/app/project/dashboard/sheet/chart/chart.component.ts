import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Chart } from '../../../../shared/models/chart.model';
import { ChartTemplate } from './chart-template';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent {
  @Input() chart: Chart;
  @Input() chartTemplate: ChartTemplate;

  @Output() removeEmitter = new EventEmitter();
  @Output() editEmitter = new EventEmitter();

  map: any;

  remove(): void {
    this.removeEmitter.emit();
  }

  edit(): void {
    this.editEmitter.emit();
  }

  exportImage(event: any) {
    // @ts-ignore: Plotly is added to window, but typescript does not know that
    window.Plotly.toImage(document.getElementById(String(this.chart.id))).then(url => {
      console.log(url);
      // TODO make this not so ugly
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Download.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}
