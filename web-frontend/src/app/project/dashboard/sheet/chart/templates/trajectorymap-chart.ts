import { ChartTemplate } from '../chart-template';
import * as mapboxgl from 'mapbox-gl';
import { SensorTableModel } from '../../../../../shared/models/sensor-table.model';
import { ChartParameter } from '../../../../../shared/models/chart-parameter.model';

export class TrajectoryMapChart implements ChartTemplate {
  id: number;
  name: string;
  parameters: ChartParameter[];
  options: any;
  sensorTable: SensorTableModel;
  map: any;
  chartId: number;
  visualizationLibrary: string;

  constructor(chartId: number) {
    this.id = 7;
    this.name = 'TrajectoryMap';
    this.options = {};
    this.chartId = chartId;
    this.visualizationLibrary = 'mapbox';
  }

  setSensorTable(sensortable: SensorTableModel) {
    setTimeout(() => {
      this.sensorTable = sensortable;
      const coordinatesByGroup = {};
      let groupedData = {};

      if (sensortable) {
        const groupByParameter = this.parameters.find(parameter => parameter.templateParameter === 'groupBy');
        const fieldIndex = this.sensorTable.fields.findIndex(field => field === groupByParameter.assignedField);
        if (fieldIndex === -1) {
          return console.log('not yet supporing default');
        }
        console.log(fieldIndex);
        groupedData = this.sensorTable.data.reduce((acc, entry) => {
          (acc[entry[fieldIndex]] = acc[entry[fieldIndex]] || []).push(entry);
          return acc;
        }, {});

        const coordinatesByGroupLat = {};
        const coordinatesByGroupLon = {};
        this.parameters.forEach(parameter => {
          const sensorTableFieldIndex = this.sensorTable.fields.findIndex(field => field === parameter.assignedField);
          if (parameter.templateParameter === 'lat') {
            for (const key in groupedData) {
              if (groupedData.hasOwnProperty(key)) {
                coordinatesByGroupLat[key] = groupedData[key].map(entry => entry[sensorTableFieldIndex]);
              }
            }
          } else if (parameter.templateParameter === 'lon') {
            for (const key in groupedData) {
              if (groupedData.hasOwnProperty(key)) {
                coordinatesByGroupLon[key] = groupedData[key].map(entry => entry[sensorTableFieldIndex]);
              }
            }
          }
        });

        for (const key in coordinatesByGroupLon) {
          if (coordinatesByGroupLon.hasOwnProperty(key)) {
            coordinatesByGroup[key] = [];
            for (let i = 0; i < coordinatesByGroupLon[key].length; i++) {
              coordinatesByGroup[key][i] = [coordinatesByGroupLon[key][i], coordinatesByGroupLat[key][i]];
            }
          }
        }
      }

      /*const coordBounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));*/

      this.map = new mapboxgl.Map({
        container: this.chartId.toString(),
        style: 'http://172.24.25.65:8080/styles/klokantech-basic/style.json',
        // bounds: coordBounds,
        // fitBoundsOptions: { padding: 20 },
        hash: false
      });

      // Create the GeoJSON-Source
      /*const data = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      };*/

      function selectColor(colorNum, colors) {
        if (colors < 1) {
          colors = 1;
        } // defaults to one color - avoid divide by zero
        return 'hsl(' + (colorNum * (360 / colors) % 360) + ',100%,50%)';
      }

      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.on('load', () => {
        // Load the coordinates to the map

        for (const key in coordinatesByGroup) {
          if (coordinatesByGroup.hasOwnProperty(key)) {
            this.map.addSource(`point${key}`, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {
                  color: '#' + Math.floor(Math.random() * 16777215).toString(16)
                },
                geometry: {
                  type: 'LineString',
                  coordinates: coordinatesByGroup[key]
                }
              }
            });

            // Add the points to the map
            this.map.addLayer({
              id: `route${key}`,
              source: `point${key}`,
              type: 'line',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': ['get', 'color'],
                'line-width': 0.1
              }
            });
          }
        }
      });
    }, 0);
  }

  setParameter(parameters: ChartParameter[]) {
    this.parameters = parameters;
  }

  setTitle(title: string) {
    // this.options.layout.title = title;
  }
}
