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

  //   let startWidth = "1200";
  //   let startHeight = "300";

  //   let width = startWidth - margin.left - margin.right;
  //   let height = startHeight - margin.top - margin.bottom;

  const chart_box = d3.select(selectID);
  const width = 0.95 * chart_box.node().getBoundingClientRect().width;
  const height = 0.95 * chart_box.node().getBoundingClientRect().height;

  console.log(width, height);

  let svg = d3
    .select(selectID)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Here we convert pandas JSON output data to
  // an array of objects with date, count keys
  data = convertData(data);

  // Setup the x-axis and set its limits
  let x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    )
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Setup the y-axis and set its limits
  let y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.count;
      }),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Draw the line
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
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

  d3.select(window).on("resize", () => {
    const chart_box = d3.select(selectID);
    const targetWidth = 0.95 * chart_box.node().getBoundingClientRect().width;
    const targetHeight = 0.95 * chart_box.node().getBoundingClientRect().height;

    svg.attr("width", targetWidth);
    svg.attr("height", targetHeight);
  });
};

export default draw;
