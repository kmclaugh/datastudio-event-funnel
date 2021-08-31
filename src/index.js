const d3 = require("d3");
const d3Format = require("d3-format");
const dscc = require("@google/dscc");
const local = require("./localMessage.js");

const intFormat = d3Format.format(",");
const percentageFormat = d3Format.format(".2%");

// change this to 'true' for local development
// change this to 'false' before deploying
export const LOCAL = false;
const DSCC_IS_LOCAL = false;

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
    o.rate = i < data.length - 1 ? data[i + 1].value / o.value : null;
  });
};

const calculateNoConversion = (data) => {
  data.map((o, i) => {
    o.frate =
      i < data.length - 1 ? (o.value - data[i + 1].value) / o.value : null;
  });
};

const drawViz = (message) => {
  const margin = { left: 20, right: 20, top: 20, bottom: 20 };
  const vizDimensions = {
    height: dscc.getHeight() - margin.top - margin.bottom - 100,
    width: dscc.getWidth() - margin.left - margin.right,
    margin,
    tableHeight: 25,
  };
  // remove existing svg
  d3.select("body").selectAll("div").remove();

  // make a div contianer
  const div = d3
    .select("body")
    .append("div")
    .attr(
      "style",
      `margin: ${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
    )
    .attr("width", vizDimensions.width + margin.left + margin.right)
    .attr("height", vizDimensions.height + margin.top + margin.bottom);

  let data = message.tables.DEFAULT[0].eventMetrics;
  let fields = message.fields.eventMetrics;
  let cleanedData = fields.map((field, i) => {
    const newField = field;
    newField.value = Number(data[i]);
    return newField;
  });
  calculateConversion(cleanedData);
  calculateNoConversion(cleanedData);

  // xScale to distribute bars
  const sectionWidth = vizDimensions.width / data.length;
  const xPlacement = (d, i) => {
    return i * sectionWidth;
  };

  // yScale to size bars
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(cleanedData.map((d) => d.value))])
    .range([0, vizDimensions.height]);

  makeStatsTable(cleanedData, div, vizDimensions, sectionWidth);
  drawChart(
    cleanedData,
    div,
    vizDimensions,
    xPlacement,
    yScale,
    sectionWidth,
    message
  );
};

const makeStatsTable = (data, div, vizDimensions, sectionWidth) => {
  const { width, tableHeight } = vizDimensions;

  // make a table
  const table = div
    .append("table")
    .attr("width", width)
    .attr("height", tableHeight)
    .attr(
      "style",
      "table-layout: fixed; border-spacing: 0px; border-collapse: collapse;"
    );

  // add label
  const stepName = table
    .append("tr")
    .selectAll("text")
    .data(data)
    .enter()
    .append("td")
    .attr("style", "padding: 10px; border: solid 1px")
    .text((d) => d.name)
    .append("p")
    .text((d) => intFormat(d.value));
};

const arrowPolygon = (sectionWidth, margin) => {
  const height = 25;
  const width = sectionWidth / 2.5;
  var points = [
    [0, 0],
    [0, height],
    [width * 0.8, height],
    [width, height * 0.5],
    [width * 0.8, 0],
    [0, 0],
  ];
  return d3.line()(points);
};

const drawChart = (
  data,
  div,
  vizDimensions,
  xPlacement,
  yScale,
  sectionWidth,
  message
) => {
  const { margin, height, width, tableHeight } = vizDimensions;

  // make a canvas
  const svg = div.append("svg").attr("width", width).attr("height", height);

  const chartHeight = height - tableHeight - margin.top;

  // make an svg for the bar chart
  const chartSvg = svg
    .append("svg")
    .attr("x", 0)
    .attr("y", tableHeight)
    .attr("width", width)
    .attr("height", chartHeight);

  let barColor = styleVal(message, "barColor");

  const conversionArrow = svg
    .append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", (d) => {
      if (d.rate) {
        return arrowPolygon(sectionWidth, margin);
      }
    })
    .attr("transform", (d, i) => {
      return `translate(
        ${xPlacement(d, i) + sectionWidth / 1.75}
        ,
        ${chartHeight - 67}
        )`;
    })
    .attr("stroke", "#a4a4a4")
    .attr("fill", "#a4a4a4");

  // add conversion rate
  const conversion = svg
    .append("g")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d, i) => xPlacement(d, i) + sectionWidth * 0.75)
    .attr("y", (d) => chartHeight - 50)
    .attr("text-anchor", "middle")
    .attr("font-size", ".75em")
    .attr("fill", "white")
    .text((d) => (d.rate ? percentageFormat(d.rate) : ""));

  // add failure rate
  const noConversion = svg
    .append("g")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d, i) => xPlacement(d, i) + sectionWidth * 0.75)
    .attr("y", (d) => chartHeight)
    .attr("text-anchor", "middle")
    .attr("font-size", "1em")
    .attr("fill", "red")
    .text((d) => (d.frate ? percentageFormat(d.frate) : ""));

  // add bars
  const bars = chartSvg
    .append("g")
    .attr("class", "bars")
    .selectAll("rect.bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xPlacement(d, i))
    .attr("y", (d) => chartHeight - yScale(d.value))
    .attr("width", sectionWidth / 2)
    .attr("height", (d) => yScale(d.value))
    .attr("fill", barColor);
};

// renders locally
if (DSCC_IS_LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
