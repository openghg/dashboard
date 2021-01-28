import * as d3 from "d3";
import { cloneDeep } from "lodash";
import "./LineChart.css";

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
  //   Here we convert pandas JSON output data to
  //   an array of objects with date, count keys
  data = convertData(data);

  d3.select(selectID + " > *").remove();

  const divWidth = props.width;
  const divHeight = props.height;

  const margin = { top: 0, right: 30, bottom: 50, left: 40 };
  const width = divWidth - margin.left - margin.right;
  const height = divHeight - margin.top - margin.bottom;

  // Setup the x-axis and set its limits
  let x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    )
    .range([0, width]);

  // Add Y axis
  let y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.count;
      }),
    ])
    .range([height, 0]);

  const svg = d3
    .select(selectID)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const lineColour = props.colour;
  // Draw the line first so it doesn't overlay the axes
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", lineColour)
    .attr("stroke-width", 1.5)
    .attr(
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

  // Add the x-axis to the svg
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add the y-axis
  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y).ticks(4));
};

export default draw;
