/* 
1 - graph dimensions
2 - fetch data
3 - x,y scale
4 - x, y axis
5 - SVG
6 - dots
7 - tooltip, show/hide
*/

//dimensions
const w = 700;
const h = 450;
const p = 30;

//fetch data
fetch(
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").

then(function (response) {
  return response.json();
}).
then(function (data) {

  // format date object
  //thx for this the other users
  let parsedTime;
  data.forEach(d => {
    parsedTime = d.Time.split(":");
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
  });

  // x, y scale
  const xScale = d3.
  scaleLinear().
  domain([
  d3.min(data, d => d.Year - 1),
  d3.max(data, d => d.Year + 1)]).

  range([p, w - p]);

  const yScale = d3.
  scaleTime().
  domain([
  d3.max(data, d => d.Time),
  d3.min(data, d => d.Time)]).

  range([h - p, p]);

  // axises
  const xAxis = d3.
  axisBottom().
  scale(xScale).
  tickFormat(d3.format("d"));
  const yAxis = d3.
  axisLeft().
  scale(yScale).
  tickFormat(d3.timeFormat("%M:%S"));

  // tooltip
  const div = d3.
  select(".container").
  append("div").
  attr("id", "tooltip").
  attr("class", "tooltip").
  style("opacity", 0).
  style("position", "absolute");

  // SVG
  const svg = d3.
  select(".container").
  append("svg").
  attr("width", w + 65).
  attr("height", 480).
  style("display", "block").
  style("margin", "auto");

  // dot
  svg.
  selectAll(".dot").
  data(data).
  enter().
  append("circle").
  attr("class", "dot").
  attr("r", d => 6).
  attr("cx", d => xScale(d.Year)).
  attr("cy", d => yScale(d.Time)).
  attr("data-xvalue", d => d.Year).
  attr("data-yvalue", (d, i) => d.Time.toISOString()).
  attr("transform", "translate(30, 0)").
  style("fill", d => {
    if (d.Doping !== "") {
      return "red";
    } else {
      return "blue";
    }
  })
  //show/hide tooltip
  .on("mouseover", d => {
    div.style("opacity", 1);
    div.attr("data-year", d.Year);
    div.
    html(
    `${d.Name} (${d.Nationality}) <br>Year: ${
    d.Year}<br>Time: ${d.Time.getMinutes()}:${d.Time.getSeconds()}`).

    style("left", d3.event.pageX + 50 + "px").
    style("top", d3.event.pageY - 28 + "px");
  }).
  on("mouseout", d => {
    div.style("opacity", 0);
  });
  // x, y axises svg
  svg.
  append("g").
  attr("id", "x-axis").
  attr("transform", "translate(30," + (h - p) + ")").
  call(xAxis);

  svg.
  append("g").
  attr("id", "y-axis").
  attr("transform", "translate(65, 0)").
  call(yAxis);

  // legend
  const legend = svg.
  selectAll(".legend").
  data(["doping", "No doping"]).
  enter().
  append("g").
  attr("id", "legend").
  attr("class", "legend").
  attr("transform", "translate(" + (w - 90) + ", 50)");
  legend.
  append("text").
  attr("y", (d, i) => i * 20 + 5).
  attr("x", 15).
  text(d => d);
  legend.
  append("circle").
  attr("cy", (d, i) => i * 20).
  attr("r", 8).
  attr("fill", d => {
    if (d == "doping") {
      return "red";
    } else {
      return "blue";
    }
  });
});