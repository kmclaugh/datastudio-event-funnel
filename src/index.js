const d3 = require("d3");
const d3Format = require("d3-format");
const lodash = require("lodash");
const dscc = require("@google/dscc");
const local = require("./localMessage.js");

const { keyBy, sortBy } = lodash;
const percentageFormat = d3Format.format(".2%");

// change this to 'true' for local development
// change this to 'false' before deploying
export const LOCAL = false;
const DSCC_IS_LOCAL = LOCAL;

const createSortLookup = (eventOrderString) => {
  let i = -1;
  return keyBy(eventOrderString.split(","), (o) => {
    i++;
    return i;
  });
};

const styleVal = (message, styleId) => {
  if (typeof message.style[styleId].defaultValue === "object") {
    return message.style[styleId].value.color !== undefined
      ? message.style[styleId].value.color
      : message.style[styleId].defaultValue.color;
  }
  return message.style[styleId].value !== undefined
    ? message.style[styleId].value
    : message.style[styleId].defaultValue;
};

const calculateConversion = (data) => {
  data.map((o, i) => {
    o.rate = i !== 0 ? o.eventMetric[0] / data[i - 1].eventMetric[0] : null;
  });
};

const calculateNoConversion = (data) => {
  data.map((o, i) => {
    console.log(i, data.length);
    o.frate =
      i < data.length - 1
        ? (o.eventMetric[0] - data[i + 1].eventMetric[0]) / o.eventMetric[0]
        : null;
  });
};

const drawViz = (message) => {
  const vizDimensions = {
    height: dscc.getHeight() - 10,
    width: dscc.getWidth(),
    margin: { left: 20, right: 20, top: 50, bottom: 20 },
    tableHeight: 0,
  };
  // remove existing svg
  d3.select("body").selectAll("svg").remove();

  // make a div contianer
  const div = d3
    .select("body")
    .append("div")
    .attr("width", vizDimensions.width)
    .attr("height", vizDimensions.height);

  const sortLookup = createSortLookup(message.style.eventOrder.value);
  let data = message.tables.DEFAULT;
  data = sortBy(data, (o) => sortLookup[o.eventOrderDimension[0]]);
  calculateConversion(data);
  calculateNoConversion(data);
  message.tables.DEFAULT = sortBy(message.tables.DEFAULT);

  drawChart(message, div, vizDimensions);
};

const drawChart = (message, div, vizDimensions) => {
  const { margin, height, width, tableHeight } = vizDimensions;

  // make a canvas
  const svg = div.append("svg").attr("width", width).attr("height", height);

  const chartHeight = height - tableHeight - margin.top;
  const chartWidth = width - margin.left - margin.right;

  // make an svg for the bar chart
  const chartSvg = svg
    .append("svg")
    .attr("x", margin.left)
    .attr("y", tableHeight)
    .attr("width", chartWidth)
    .attr("height", chartHeight);

  // xScale to distribute bars
  const xScale = d3
    .scaleBand()
    .domain(message.tables.DEFAULT.map((d) => d.eventNameDimension[0]))
    .range([0, chartWidth])
    .paddingInner(0.3);

  // yScale to size bars
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(message.tables.DEFAULT.map((d) => d.eventMetric[0]))])
    .range([0, chartHeight]);

  let barColor = styleVal(message, "barColor");

  // add text
  const amount = svg
    .append("g")
    .selectAll("text")
    .data(message.tables.DEFAULT)
    .enter()
    .append("text")
    .attr(
      "x",
      (d) =>
        xScale(d.eventNameDimension[0]) + xScale.bandwidth() / 2 + margin.left
    )
    .attr("y", (d) => chartHeight - yScale(d.eventMetric[0]) + margin.top / 2)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text((d) => d.eventMetric[0]);

  // add conversion rate
  const conversion = svg
    .append("g")
    .selectAll("text")
    .data(message.tables.DEFAULT)
    .enter()
    .append("text")
    .attr(
      "x",
      (d) =>
        xScale(d.eventNameDimension[0]) + xScale.bandwidth() / 2 + margin.left
    )
    .attr("y", (d) => chartHeight - yScale(d.eventMetric[0]) + margin.top)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text((d) => (d.rate ? percentageFormat(d.rate) : ""));

  // add failure rate
  const noConversion = svg
    .append("g")
    .selectAll("text")
    .data(message.tables.DEFAULT)
    .enter()
    .append("text")
    .attr(
      "x",
      (d) =>
        xScale(d.eventNameDimension[0]) + xScale.bandwidth() / 2 + margin.left
    )
    .attr("y", (d) => chartHeight - margin.bottom)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text((d) => (d.frate ? percentageFormat(d.frate) : ""));

  // add bars
  const bars = chartSvg
    .append("g")
    .attr("class", "bars")
    .selectAll("rect.bars")
    .data(message.tables.DEFAULT)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.eventNameDimension[0]))
    .attr("y", (d) => chartHeight - yScale(d.eventMetric[0]))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => yScale(d.eventMetric[0]))
    .attr("fill", barColor);

  // add text
  const labels = svg
    .append("g")
    .selectAll("text")
    .data(message.tables.DEFAULT)
    .enter()
    .append("text")
    .attr(
      "x",
      (d) =>
        xScale(d.eventNameDimension[0]) + xScale.bandwidth() / 2 + margin.left
    )
    .attr("y", height - margin.bottom / 4)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .text((d) => d.eventNameDimension[0]);
};

// renders locally
if (DSCC_IS_LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
