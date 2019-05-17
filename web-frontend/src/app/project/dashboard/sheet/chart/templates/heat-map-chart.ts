import { ChartTemplate } from '../chart-template';
import * as mapboxgl from 'mapbox-gl';
import { SensorTableModel } from '../../../../../shared/models/sensor-table.model';
import { ChartParameter } from '../../../../../shared/models/chart-parameter.model';

export class HeatMapChart implements ChartTemplate {
  id: number;
  name: string;
  parameters: ChartParameter[];
  options: any;
  sensorTable: SensorTableModel;
  map: any;
  chartId: number;
  visualizationLibrary: string;

  constructor(chartId: number) {
    this.id = 5;
    this.name = 'HeatMapChart';
    this.options = {};
    this.chartId = chartId;
    this.visualizationLibrary = 'mapbox';
  }

  setSensorTable(sensortable: SensorTableModel) {
    setTimeout(() => {
      this.sensorTable = sensortable;
      const coordinates = [];
      if (sensortable) {
        let coordinatesLat = [];
        let coordinatesLon = [];
        this.parameters.forEach(parameter => {
          const sensorTableFieldIndex = this.sensorTable.fields.findIndex(field => field === parameter.assignedField);
          if (parameter.templateParameter === 'lat') {
            coordinatesLat = this.sensorTable.data.map(entry => entry[sensorTableFieldIndex]);
          } else if (parameter.templateParameter === 'lon') {
            coordinatesLon = this.sensorTable.data.map(entry => entry[sensorTableFieldIndex]);
          }
        });
        for (let i = 0; i < coordinatesLat.length; i++) {
          coordinates[i] = [coordinatesLon[i], coordinatesLat[i]];
        }
      }
      const coordBounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      this.map = new mapboxgl.Map({
        container: this.chartId.toString(),
        style: 'http://172.24.25.65:8080/styles/klokantech-basic/style.json',
        bounds: coordBounds,
        fitBoundsOptions: {padding: 20},
        hash: false
      });

      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.on('load', () => {
        this.map.addLayer({
          id: 'earthquakes-heat',
          type: 'heatmap',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates
              }
            }
          },
          paint: {
            // Increase the heatmap weight based on frequency and property magnitude
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(33,102,172,0)',
              0.2,
              'rgb(103,169,207)',
              0.4,
              'rgb(209,229,240)',
              0.6,
              'rgb(253,219,199)',
              0.8,
              'rgb(239,138,98)',
              1,
              'rgb(178,24,43)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
          }
        });
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
