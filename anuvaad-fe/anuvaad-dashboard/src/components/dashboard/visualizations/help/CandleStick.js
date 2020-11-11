import React from "react";
import * as d3 from "d3";
import _ from "lodash";

class CandleStick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
    this.loadChart = this.loadChart.bind(this);
    this.anchor = React.createRef();
  }

  componentDidMount() {
    fetch("./json/CandleData.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(messages => {
        this.setState(
          {
            data: messages
          },
          () => {
            this.loadChart(this.state.data);
          }
        );
      });
  }

  loadChart = data => {
    // console.log(data);
    d3.select(this.anchor.current)
      .select("svg")
      .remove();
    var dateFormat = d3.timeParse("%Y-%m-%d");
    for (var i = 0; i < data.length; i++) {
      data[i]["Date"] = dateFormat(data[i]["Date"]);
    }

    const margin = { top: 15, right: 65, bottom: 205, left: 50 },
      w = 420 - margin.left - margin.right,
      h = 400 - margin.top - margin.bottom;

    var svg = d3
      .select(this.anchor.current)
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let dates = _.map(data, "Date");
    // let hours, minutes, months, amPM, filtered, minP, maxP, buffer;

    // var xmin = d3.min(data.map(r => r.Date.getTime()));
    // var xmax = d3.max(data.map(r => r.Date.getTime()));
    var xScale = d3
      .scaleLinear()
      .domain([-1, dates.length])
      .range([0, w]);
    // var xDateScale = d3
    //   .scaleQuantize()
    //   .domain([0, dates.length])
    //   .range(dates);
    let xBand = d3
      .scaleBand()
      .domain(d3.range(-1, dates.length))
      .range([0, w])
      .padding(0.3);
    var xAxis = d3.axisBottom().scale(xScale);

    const tooltip = d3
      .select("div.row")
      .append("div")
      .attr("class", "tooltip");

    svg
      .append("rect")
      .attr("id", "rect")
      .attr("width", w)
      .attr("height", h)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("clip-path", "url(#clip)");

    var gX = svg
      .append("g")
      .attr("class", "axis x-axis") //Assign "axis" class
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);

    gX.selectAll(".tick text").call(wrap, xBand.bandwidth());

    var ymin = d3.min(data.map(r => r.Low));
    var ymax = d3.max(data.map(r => r.High));
    var yScale = d3
      .scaleLinear()
      .domain([ymin, ymax])
      .range([h, 0])
      .nice();
    var yAxis = d3.axisLeft().scale(yScale);

    svg
      .append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    var chartBody = svg
      .append("g")
      .attr("class", "chartBody")
      .attr("clip-path", "url(#clip)");

    // draw rectangles
    chartBody
      .selectAll(".candle")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
      .attr("class", "candle")
      .attr("y", d => yScale(Math.max(d.Open, d.Close)))
      .attr("width", xBand.bandwidth())
      .attr("height", d =>
        d.Open === d.Close
          ? 1
          : yScale(Math.min(d.Open, d.Close)) -
            yScale(Math.max(d.Open, d.Close))
      )
      .attr("fill", d =>
        d.Open === d.Close
          ? "#3CB44B"
          : d.Open > d.Close
          ? "#4364D8"
          : "#42D4F4"
      )
      .on("mouseover", function(d, i) {
        d3.event.stopPropagation();
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 1);
        tooltip
          .html("<b>" + d.Open + "</b>")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(2000)
          .style("opacity", 0);
      });

    // draw high and low
    chartBody
      .selectAll("g.line")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "stem")
      .attr("x1", (d, i) => xScale(i) - xBand.bandwidth() / 2)
      .attr("x2", (d, i) => xScale(i) - xBand.bandwidth() / 2)
      .attr("y1", d => yScale(d.High))
      .attr("y2", d => yScale(d.Low))
      .attr("stroke", d =>
        d.Open === d.Close
          ? "#3CB44B"
          : d.Open > d.Close
          ? "#4364D8"
          : "#42D4F4"
      );

    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", w)
      .attr("height", h);

    // const extent = [
    //   [0, 0],
    //   [w, h]
    // ];
    //
    // var resizeTimer;

    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
          words = text
            .text()
            .split(/\s+/)
            .reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1,
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text
            .text(null)
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", dy + "em");
        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", 0)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    }
  };

  render() {
    return (
      <svg className="ml-2" viewBox="0 0 420 225">
        <g ref={this.anchor} />;
      </svg>
    );
    // return <g ref={this.anchor} />;
  }
}

export default CandleStick;
