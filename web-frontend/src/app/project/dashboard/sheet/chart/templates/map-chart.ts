import { ChartTemplate } from '../chart-template';
import * as mapboxgl from 'mapbox-gl';
import { SensorTableModel } from '../../../../../shared/models/sensor-table.model';
import { ChartParameter } from '../../../../../shared/models/chart-parameter.model';

export class MapChart implements ChartTemplate {
  id: number;
  name: string;
  parameters: ChartParameter[];
  options: any;
  sensorTable: SensorTableModel;
  map: any;
  chartId: number;
  visualizationLibrary: string;

  constructor(chartId: number) {
    this.id = 3;
    this.name = 'MapChart';
    this.options = {};
    this.chartId = chartId;
    this.visualizationLibrary = 'mapbox';
  }

  setSensorTable(sensortable: SensorTableModel) {
    setTimeout(() => {
      this.sensorTable = sensortable;
      const coordinates = [];
      let content = [];
      if (sensortable) {
        let coordinatesLat = [];
        let coordinatesLon = [];
        this.parameters.forEach(parameter => {
          const sensorTableFieldIndex = this.sensorTable.fields.findIndex(field => field === parameter.assignedField);
          if (parameter.templateParameter === 'lat') {
            coordinatesLat = this.sensorTable.data.map(entry => entry[sensorTableFieldIndex]);
          } else if (parameter.templateParameter === 'lon') {
            coordinatesLon = this.sensorTable.data.map(entry => entry[sensorTableFieldIndex]);
          } else if (parameter.templateParameter === 'content') {
            content = this.sensorTable.data.map(entry => entry[sensorTableFieldIndex]);
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
        fitBoundsOptions: { padding: 20 },
        hash: false
      });

      const data = [];
      for (let i = 0; i < coordinates.length; i++) {
        data[i] = {
          type: 'Feature',
          properties: { content: content[i] },
          geometry: {
            type: 'Point',
            coordinates: coordinates[i]
          }
        };
      }

      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.on('load', () => {
        this.map.addSource(`point`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: data
          }
        });


        this.map.addLayer({
          id: `point`,
          source: `point`,
          type: 'circle',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['get', 'content'], 0.23, 2, 0.27, 30],
            'circle-color': ['interpolate', ['linear'], ['get', 'content'], 0.23, '#00FF00', 0.27, '#FF0000']
          }
        });

        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        this.map.on('click', 'point', (e) => {
          const clickCoordinates = e.features[0].geometry.coordinates.slice();
          const description = 'test'; // e.features[0].properties.description;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - clickCoordinates[0]) > 180) {
            clickCoordinates[0] += e.lngLat.lng > clickCoordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(clickCoordinates)
            .setHTML(description)
            .addTo(this.map);
        });

        /*this.map.addLayer({
          id: 'route',
          type: 'line',
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
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#2E67F6',
            'line-width': 0.3
          }
        });*/
        /* this.map.addLayer({
          id: 'route',
          type: 'symbol',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates
              }
            }
          },
          paint: {
            'circle-radius': {
              stops: [
                [5, 1],
                [15, 1024]
              ],
              base: 2
            },
            'circle-color': 'red',
            'circle-opacity': 0.6
          }
        }); */
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
