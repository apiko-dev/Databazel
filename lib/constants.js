const stringOperatorsOptions = [
  { value: '=', label: '=' },
  { value: '<>', label: '≠' },
  { value: 'LIKE', label: 'like' },
  { value: '<> null', label: 'not null' },
];

const numberOperatorsOptions = [
  { value: '=', label: '=' },
  { value: '<>', label: '≠' },
  { value: '>', label: '>' },
  { value: '>=', label: '>=' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' },
  { value: '<> null', label: 'not null' },
];

const dateParts = ['minute', 'hour', 'day', 'month', 'year'];

const defaultChartLocation = { x: 0, y: 100, w: 9, h: 8 };
const defaultBreakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const defaultBreakpointsCols = { lg: 22, md: 16, sm: 12, xs: 8, xxs: 6 };
const gridSystemRowHeight = 30;

const milisecondsInDay = 43200000;

const chartTypeRules = {
  bar: { dimensions: 2, measures: 1000 },
  line: { dimensions: 2, measures: 1000 },
  pie: { dimensions: 1, measures: 1 },
  polar: { dimensions: 1, measures: 1 },
  doughnut: { dimensions: 1, measures: 1 },
  polarArea: { dimensions: 1, measures: 1 },
  radar: { dimensions: 2, measures: 1000 },
  scatter: { x: 1, y: 2 },
};

const pivotModelRules = {
  columns: 3,
  rows: 3,
  values: 1,
};

const pivotCellsLimit = 2000;

const chartSize = {
  width: '1000',
  height: '500',
};

const maxStringLengthOnChart = 30;

const defaultChartIframeSize = {
  defaultWidth: 500,
  minWidth: 200,
  maxWidth: 2500,
  defaultHeight: 250,
  minHeight: 100,
  maxHeight: 1000,
};

const fieldTypes = [
  'number',
  'string',
  'boolean',
  'object',
  'date',
  'array',
];

const convertTypesRules = {
  string: ['string'],
  number: ['number', 'date', 'string'],
  boolean: ['boolean', 'string'],
  date: ['date', 'string'],
};

const chartRefreshingDelaySeconds = 10;

export {
  stringOperatorsOptions,
  numberOperatorsOptions,
  dateParts,
  defaultChartLocation,
  defaultBreakpoints,
  defaultBreakpointsCols,
  gridSystemRowHeight,
  milisecondsInDay,
  chartTypeRules,
  pivotCellsLimit,
  chartSize,
  maxStringLengthOnChart,
  pivotModelRules,
  defaultChartIframeSize,
  fieldTypes,
  convertTypesRules,
  chartRefreshingDelaySeconds,
};
