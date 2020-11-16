const d3 = require("d3");
const lodash = require("lodash");
const dscc = require("@google/dscc");
const local = require("./localMessage.js");

const { keyBy, sortBy } = lodash;

// change this to 'true' for local development
// change this to 'false' before deploying
export const LOCAL = false;

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

const drawViz = (message) => {
  const vizDimensions = {
    height: dscc.getHeight() - 10,
    width: dscc.getWidth(),
    margin: { left: 20, right: 20, top: 20, bottom: 20 },
    tableHeight: 150,
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

  console.log(message);
  console.log(sortLookup);
  console.log(data);
  message.tables.DEFAULT = sortBy(message.tables.DEFAULT);

  makeStatsTable(message, div, vizDimensions);
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
};

const makeStatsTable = (message, div, vizDimensions) => {
  const { margin, width, tableHeight } = vizDimensions;
  const tableWidth = width - margin.left - margin.right;

  // make a table
  const table = div
    .append("table")
    .attr("width", tableWidth)
    .attr("height", tableHeight);

  // xScale to distribute bars
  const xScale = d3
    .scaleBand()
    .domain(message.tables.DEFAULT.map((d) => d.eventNameDimension[0]))
    .range([0, tableWidth])
    .paddingInner(0.3);

  // add label
  const text = table
    .append("tr")
    .selectAll("text")
    .data(message.tables.DEFAULT)
    .enter()
    .append("td")
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "26px")
    .attr("font-family", "Roboto, sans-serif")
    .attr("font-weight", "400")
    .attr("width", xScale.bandwidth())
    .text((d) => d.eventNameDimension[0]);

  // add number
  // const text2 = tableSvg
  //   .append("g")
  //   .selectAll("text")
  //   .data(message.tables.DEFAULT)
  //   .enter()
  //   .append("text")
  //   .attr("x", (d) => xScale(d.eventNameDimension[0]) + xScale.bandwidth() / 2)
  //   .attr("y", margin.top * 3)
  //   .attr("text-anchor", "middle")
  //   .attr("fill", "black")
  //   .attr("font-size", "26px")
  //   .attr("font-family", "Roboto, sans-serif")
  //   .attr("font-weight", "400")
  //   .attr("width", xScale.bandwidth())
  //   .text((d) => d.eventMetric[0]);
};

// renders locally
if (DSCC_IS_LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
