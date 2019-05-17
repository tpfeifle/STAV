import { ChartTemplate } from '../chart-template';
import { ChartParameter } from '../../../../../shared/models/chart-parameter.model';
import { SensorTableModel } from '../../../../../shared/models/sensor-table.model';

export class LineChart implements ChartTemplate {
  id: number;
  name: string;
  parameters: ChartParameter[];
  options: any;
  sensorTable: SensorTableModel;
  visualizationLibrary: string;
  constructor() {
    this.id = 1;
    this.name = 'LineChart';
    this.options = JSON.parse(JSON.stringify(defaultOptions));
    this.visualizationLibrary = 'plotly';
  }

  setSensorTable(sensortable: SensorTableModel) {
    this.sensorTable = sensortable;
    // set data
    if (sensortable) {
      this.parameters.forEach(parameter => {
        const sensorTableFieldIndex = this.sensorTable.fields.findIndex(field => field === parameter.assignedField);
        if (parameter.templateParameter === 'xAxis') {
          this.options.data[0].x = this.sensorTable.data.map(entry => entry[sensorTableFieldIndex]);
          this.options.layout.xaxis.title = parameter.assignedField;
        } else {
          this.options.data[0].y = this.sensorTable.data.map(entry => entry[sensorTableFieldIndex]);
          this.options.layout.yaxis.title = parameter.assignedField;
        }
      });
    }
  }

  setParameter(parameters: ChartParameter[]) {
    this.parameters = parameters;
  }

  setTitle(title: string) {
    this.options.layout.title = title;
  }
}

const defaultOptions = {
  data: [
    {
      x: [], // to be filled
      y: [], // to be filled
      type: 'line',
      mode: 'lines+points',
      marker: { color: '#2E67F6' }
    }
  ],
  layout: {
    title: '',
    xaxis: { title: '' },
    yaxis: { title: '' },
    margin: { l: 50, r: 30, b: 40, t: 30, pad: 0 },
    autosize: true
  },
  config: {
    displayModeBar: false,
    toImageButtonOptions: {
      format: 'svg', // one of png, svg, jpeg, webp
      filename: 'custom_image',
      height: 500,
      width: 700,
      scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
    }
  }
};
