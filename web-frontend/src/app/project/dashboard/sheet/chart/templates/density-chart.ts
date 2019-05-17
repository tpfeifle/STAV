import { ChartTemplate } from '../chart-template';
import { ChartParameter } from '../../../../../shared/models/chart-parameter.model';
import { SensorTableModel } from '../../../../../shared/models/sensor-table.model';

const N = 2000;
const a = -1;
const b = 1.2;
const step = (b - a) / (N - 1);

export class DensityChart implements ChartTemplate {
  id: number;
  name: string;
  parameters: ChartParameter[];
  options: any;
  sensorTable: SensorTableModel;
  visualizationLibrary: string;
  constructor() {
    this.id = 4;
    this.name = 'DensityChart';
    this.options = JSON.parse(JSON.stringify(defaultOptions));
    this.visualizationLibrary = 'plotly';
  }

  setSensorTable(sensortable: SensorTableModel) {
    this.sensorTable = sensortable;
    // set data
    if (sensortable) {
      let x = [];
      let y = [];
      this.parameters.forEach(parameter => {
        const sensorTableFieldIndex = this.sensorTable.fields.findIndex(field => field === parameter.assignedField);
        if (parameter.templateParameter === 'xAxis') {
          x = this.sensorTable.data.map(entry => entry[sensorTableFieldIndex]);
          this.options.layout.xaxis.title = parameter.assignedField;
        } else {
          y = this.sensorTable.data.map(entry => entry[sensorTableFieldIndex]);
          this.options.layout.yaxis.title = parameter.assignedField;
        }
      });

      const trace1 = {
        x: x,
        y: y,
        mode: 'markers',
        name: 'points',
        marker: {
          color: '#2E67F6',
          size: 2,
          opacity: 0.4
        },
        type: 'scatter'
      };
      const trace3 = {
        x: x,
        name: 'x density',
        marker: { color: '#2E67F6' },
        yaxis: 'y2',
        type: 'histogram'
      };
      const trace4 = {
        y: y,
        name: 'y density',
        marker: { color: '#2E67F6' },
        xaxis: 'x2',
        type: 'histogram'
      };
      this.options.data = [trace1, trace3, trace4];
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
  data: [],
  layout: {
    showlegend: false,
    width: 400,
    height: 450,
    margin: { l: 40, r: 0, b: 40, t: 30, pad: 0 },
    autosize: true,
    hovermode: 'closest',
    bargap: 0,
    xaxis: {
      domain: [0, 0.85],
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      domain: [0, 0.85],
      showgrid: false,
      zeroline: false
    },
    xaxis2: {
      domain: [0.85, 1],
      showgrid: false,
      zeroline: false
    },
    yaxis2: {
      domain: [0.85, 1],
      showgrid: false,
      zeroline: false
    }
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

function normal() {
  let x = 0;
  let y = 0;
  let rds;
  let c;
  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    rds = x * x + y * y;
  } while (rds === 0 || rds > 1);
  c = Math.sqrt((-2 * Math.log(rds)) / rds); // Box-Muller transform
  return x * c; // throw away extra sample y * c
}
