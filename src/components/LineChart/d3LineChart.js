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

const draw = (props, divWidth, divHeight) => {
  const selectID = "." + props.divID;

  //   let data = [];

  //   if (props.data !== null) {
  //     data = cloneDeep(props.data);
  //   }

  //   d3.selectAll(selectID).remove();

  d3.select(selectID + " > *").remove();

  const margin = { top: 10, right: 20, bottom: 30, left: 30 };

  // the exact dimensions of 400 x 400
  // will only be used for the initial render
  // but the width to height proportion
  // will be preserved as the chart is resized
  const width = divWidth - margin.left - margin.right;
  const height = divHeight - margin.top - margin.bottom;

  const data = [5, 15, 25, 35, 45, 55, 65, 76, 85, 95];

  const xScale = d3.scaleBand().padding(0.2).domain(data).range([0, width]);

  const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

  const svg = d3
    .select(selectID)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d))
    .attr("y", (d) => yScale(d))
    .attr("width", (d) => xScale.bandwidth())
    .attr("height", (d) => height - yScale(d));

  svg.append("g").call(d3.axisLeft(yScale));

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  console.log(divWidth, divHeight);

  // Here we convert pandas JSON output data to
  // an array of objects with date, count keys
  //   data = convertData(data);

  //   d3.select(selectID + " > *").remove();
  //   let margin = { top: 20, right: 20, bottom: 30, left: 40 };

  //   let width = props.width - margin.left - margin.right;
  //   let height = props.height - margin.top - margin.bottom;

  //   // Setup the x-axis and set its limits
  //   let x = d3
  //     .scaleTime()
  //     .domain(
  //       d3.extent(data, function (d) {
  //         return d.date;
  //       })
  //     )
  //     .range([0, width]);

  //   // Setup the y-axis and set its limits
  //   //   const yScale = d3
  //   //     .scaleLinear()
  //   //     .domain([
  //   //       0,
  //   //       d3.max(data, function (d) {
  //   //         return d.count;
  //   //       }),
  //   //     ])
  //   //     .range([height, 0]);

  //   // Add Y axis
  //   let y = d3
  //     .scaleLinear()
  //     .domain([
  //       0,
  //       d3.max(data, function (d) {
  //         return +d.count;
  //       }),
  //     ])
  //     .range([height, 0]);

  //   const svg = d3
  //     .select(selectID)
  //     .append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //     .call(responsive)
  //     .append("g")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //   // Add the x-axis to the svg
  //   svg
  //     .append("g")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(x));

  //   // Add the y-axis
  //   svg.append("g").call(d3.axisLeft(y));

  //   // Draw the line itself
  //   svg
  //     .append("path")
  //     .datum(data)
  //     .attr("fill", "none")
  //     .attr("stroke", "steelblue")
  //     .attr("stroke-width", 1.5)
  //     .attr(
  //       "d",
  //       d3
  //         .line()
  //         .x(function (d) {
  //           return x(d.date);
  //         })
  //         .y(function (d) {
  //           return y(d.count);
  //         })
  //     );

  //   function responsive(svg) {
  //     // container will be the DOM element the svg is appended to
  //     // we then measure the container and find its aspect ratio
  //     const container = d3.select(svg.node().parentNode),
  //       width = parseInt(svg.style("width"), 10),
  //       height = parseInt(svg.style("height"), 10),
  //       aspect = width / height;

  //     // add viewBox attribute and set its value to the initial size
  //     // add preserveAspectRatio attribute to specify how to scale
  //     // and call resize so that svg resizes on inital page load
  //     svg
  //       .attr("viewBox", `0 0 ${width} ${height}`)
  //       .attr("preserveAspectRatio", "xMinYMid")
  //       .call(resize);

  //     // add a listener so the chart will be resized when the window resizes
  //     // to register multiple listeners for same event type,
  //     // you need to add namespace, i.e., 'click.foo'
  //     // necessary if you invoke this function for multiple svgs
  //     // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  //     d3.select(window).on("resize." + container.attr("id"), resize);

  //     // this is the code that actually resizes the chart
  //     // and will be called on load and in response to window resize
  //     // gets the width of the container and proportionally resizes the svg to fit
  //     function resize() {
  //       const targetWidth = parseInt(container.style("width"));
  //       svg.attr("width", targetWidth);
  //       svg.attr("height", Math.round(targetWidth / aspect));
  //     }

  //     console.log(width, height);
  //   }
};

export default draw;
