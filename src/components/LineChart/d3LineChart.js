import * as d3 from "d3";
import { cloneDeep } from "lodash";

function convertData(data) {
  // Takes the pandas exported JSON data and converts timestamps
  //
  // Args:
  //    data (object): JSON output from pandas
  // Returns:
  //    Array: array of Objects with date and value keys
  let dated_data = [];

  for (const [key, value] of Object.entries(data)) {
    const date = new Date(parseInt(key));
    let date_obj = { date: date, count: value };

    dated_data.push(date_obj);
  }

  return dated_data;
}

const draw = (props) => {
  const selectID = "." + props.divID;

  let data = [];

  if (props.data !== null) {
    data = cloneDeep(props.data);
  }

  d3.select(selectID + " > *").remove();
  let margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 800; //props.width - margin.left - margin.right;
  const height = 300; //props.height - margin.top - margin.bottom;

  let svg = d3
    .select(selectID)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
    
  // Here we convert pandas JSON output data to
  // an array of objects with date, count keys
  data = convertData(data);

  // Setup the x-axis and set its limits
  let x = d3.scaleTime().domain(
    d3.extent(data, function (d) {
      return d.date;
    })
  );

  let xAxis = svg.append("g").attr("transform", "translate(0," + height + ")");

  // Setup the y-axis and set its limits
  let y = d3.scaleLinear().domain([
    0,
    d3.max(data, function (d) {
      return d.count;
    }),
  ]);

  let yAxis = svg.append("g").attr("transform", "translate(0," + height + ")");

  // Draw the line
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5);

  function drawChart() {
    const currentWidth = parseInt(d3.select(selectID).style("width"), 10);
    const currentHeight = parseInt(d3.select(selectID).style("height"), 10);

    svg.attr("width", currentWidth)
    svg.attr("height", currentHeight)

    x.range([0, currentWidth]);
    y.range([currentHeight, 0]);

    xAxis.call(d3.axisBottom(x));
    yAxis.call(d3.axisLeft(y));

    svg.attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.count);
        })
    );
  }

  drawChart()

  window.addEventListener("resize", drawChart);
};

export default draw;
