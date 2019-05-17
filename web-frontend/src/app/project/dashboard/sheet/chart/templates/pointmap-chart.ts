import { ChartTemplate } from '../chart-template';
import * as mapboxgl from 'mapbox-gl';
import { SensorTableModel } from '../../../../../shared/models/sensor-table.model';
import { ChartParameter } from '../../../../../shared/models/chart-parameter.model';

export class PointMapChart implements ChartTemplate {
  id: number;
  name: string;
  parameters: ChartParameter[];
  options: any;
  sensorTable: SensorTableModel;
  map: any;
  chartId: number;
  visualizationLibrary: string;

  constructor(chartId: number) {
    this.id = 6;
    this.name = 'PointMap';
    this.options = {};
    this.chartId = chartId;
    this.visualizationLibrary = 'mapbox';
  }

  setSensorTable(sensortable: SensorTableModel) {
    setTimeout(() => {
      this.sensorTable = sensortable;
      const pointMappings = {
        lat: [],
        lon: [],
        size: [],
        color: [],
        description: []
      };
      const coordinates = [];

      const defaults = {
        size: 4,
        color: '#0000FF',
        description: null
      };

      if (sensortable) {
        this.parameters.forEach(parameter => {
          if (
            parameter.assignedField === 'default' &&
            ['color', 'size', 'description'].indexOf(parameter.templateParameter) !== -1
          ) {
            pointMappings[parameter.templateParameter] = defaults[parameter.templateParameter];
          } else {
            const sensorTableFieldIndex = this.sensorTable.fields.findIndex(field => field === parameter.assignedField);
            pointMappings[parameter.templateParameter] = this.sensorTable.data.map(
              entry => parseFloat(entry[sensorTableFieldIndex])
            );
          }
        });
        for (let i = 0; i < pointMappings.lat.length; i++) {
          coordinates[i] = [pointMappings.lon[i], pointMappings.lat[i]];
        }
      }

      console.log(pointMappings);

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

      // Create the GeoJSON-Source
      const data = [];
      for (let i = 0; i < coordinates.length; i++) {
        data[i] = {
          type: 'Feature',
          properties: {
            description: pointMappings.description[i],
            size: pointMappings.size[i],
            color: pointMappings.color[i]
          },
          geometry: {
            type: 'Point',
            coordinates: coordinates[i]
          }
        };
      }

      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.on('load', () => {
        // Load the coordinates to the map
        this.map.addSource(`point`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: data
          }
        });

        // Add the points to the map
        this.map.addLayer({
          id: `point`,
          source: `point`,
          type: 'circle',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'size'],
              Math.min(...pointMappings.size),
              1,
              1,
              20
            ],
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'color'],
              Math.min(...pointMappings.color),
              '#00FF00',
              1,
              '#0000FF'
            ]
          }
        });

        // Add description popup
        this.map.on('click', 'point', e => {
          const clickCoordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;

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
