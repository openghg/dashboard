import * as d3 from "d3";
import { cloneDeep } from "lodash";

function convertDates(data) {
  // Converts UNIX ms timestamps to dates
  let dated_data = {};

  for (const [key, value] of Object.entries(data)) {
    const converted_key = new Date(parseInt(key)).toISOString();
    dated_data[converted_key] = value;
  }

  return dated_data;
}

function draw(props) {
  const selectID = "." + props.divID;

  let data = [];

  // Here we clone the data to ensure there's no
  if (props.data !== null) {
    data = cloneDeep(props.data);
  }

  d3.select(selectID + " > *").remove();
  let margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = props.width - margin.left - margin.right;
  const height = props.height - margin.top - margin.bottom;
  let svg = d3
    .select(selectID)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Now we want to convert all the timestamps into actual dates
  // Here we need to parse the timestamp data to a date
  //   data.forEach(function (d) {
  //     d.date = d3.timeParse("%Y-%m-%d")(d.date);
  //     // %Q - milliseconds since UNIX epoch
  //     // d.date = d3.timeParse("%Q")(d.date);
  //     console.log(d.date);
  //     d.count = +d.count;
  //   });

  // Convert the UNIX ms timestamps to dates
  data = convertDates(data);

  console.log(data);

  let x = d3
    .scaleTime()
    .domain(d3.extent(Object.keys(data)))
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  let y = d3
    .scaleLinear()
    .domain([0, d3.max(Object.values(data))])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line().x(Object.keys(data)).y(Object.values(data)));
}

export default draw;
