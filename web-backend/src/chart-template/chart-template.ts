const parameters = [
  ['xAxis', 'series'], // LineChart
  ['ClusterField', 'Value'], // PieChart
  ['lat', 'lon', 'content'], // MapChart
  ['xAxis', 'series'], // DensityChart
  ['lat', 'lon', 'content'], // HeatMapChart
  ['lat', 'lon', 'size', 'color', 'description'], // PointMapChart
  ['lat', 'lon', 'groupBy'], // TrajectoryMapChart
];

export function getParametersByChartTemplateId(chartTemplateId: number) {
  return parameters[chartTemplateId - 1];
}
