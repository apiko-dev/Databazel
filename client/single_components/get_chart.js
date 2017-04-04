import { Bar, Line, Pie, Radar, PolarArea, Doughnut, Bubble } from 'react-chartjs';

const getChart = (chartType) => {
  switch (chartType) {
    case 'bar': return Bar;
    case 'line': return Line;
    case 'pie': return Pie;
    case 'radar': return Radar;
    case 'polarArea': return PolarArea;
    case 'doughnut': return Doughnut;
    case 'scatter': return Bubble;
    default: return null;
  }
};

export default getChart;
