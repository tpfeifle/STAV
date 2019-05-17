import { ChartTemplate } from '../chart-template';
import { ChartParameter } from '../../../../../shared/models/chart-parameter.model';
import { SensorTableModel } from '../../../../../shared/models/sensor-table.model';

export class BarChart implements ChartTemplate {
  id: number;
  name: string;
  parameters: ChartParameter[];
  options: any;
  sensorTable: SensorTableModel;
  visualizationLibrary: string;
  constructor() {
    this.id = 2;
    this.name = 'BarChart';
    this.options = defaultBarOptions;
    this.visualizationLibrary = 'plotly';
  }

  setSensorTable(sensortable: SensorTableModel) {
    this.sensorTable = sensortable;
    // set data
    if (sensortable && sensortable.data.length > 1) {
      let valueParameterTableFieldIndex;
      let clusterTableFieldIndex;
      this.parameters.forEach(parameter => {
        if (parameter.templateParameter === 'Value') {
          valueParameterTableFieldIndex = this.sensorTable.fields.findIndex(field => field === parameter.assignedField);
          this.options.layout.yaxis.title = parameter.assignedField;
        } else {
          clusterTableFieldIndex = this.sensorTable.fields.findIndex(field => field === parameter.assignedField);
          this.options.layout.xaxis.title = parameter.assignedField;
        }
      });

      const reduced = this.sensorTable.data.reduce((accumulator, entry) => {
        const keyName = entry[clusterTableFieldIndex].toString();
        if (accumulator.find(element => element.name === keyName)) {
          const index = accumulator.findIndex(element => element.name === keyName);
          accumulator[index].value += entry[valueParameterTableFieldIndex];
        } else {
          accumulator.push({ name: keyName, value: entry[valueParameterTableFieldIndex] });
        }
        return accumulator;
      }, []);
      this.options.data[0].x = reduced.map(x => x.name);
      this.options.data[0].y = reduced.map(x => x.value);
    }
  }

  setParameter(parameters: ChartParameter[]) {
    this.parameters = parameters;
  }

  setTitle(title: string) {
    this.options.layout.title = title;
  }
}

const defaultBarOptions = {
  data: [
    {
      x: [],
      y: [],
      type: 'bar',
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
    // modeBarButtonsToRemove: ['toImage'],
    toImageButtonOptions: {
      format: 'svg', // one of png, svg, jpeg, webp
      filename: 'custom_image',
      height: 500,
      width: 700,
      scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
    }
  }
};
