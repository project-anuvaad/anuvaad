import React from "react";
import * as d3 from "d3";

class WaterFallChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
    this.loadChart = this.loadChart.bind(this);
    this.anchor = React.createRef();
  }

  componentDidMount() {
    fetch("./json/WaterfallData.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(messages => {
        this.setState(
          prevState => ({
            data: messages
          }),
          () => {
            this.loadChart(this.state.data);
          }
        );
      });
  }

  loadChart = data => {
    var margin = { top: 20, right: 30, bottom: 30, left: 40 },
      width = 420 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom,
      padding = 0.3;

    var svg = d3.select(this.anchor.current);

    var x = d3.scaleBand().rangeRound([0, width], padding);

    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom().scale(x);

    var yAxis = d3
      .axisLeft()
      .scale(y)
      .tickFormat(function(d) {
        return dollarFormatter(d);
      });

    var chart = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var cumulative = 0;
    for (var i = 0; i < data.length; i++) {
      data[i].start = cumulative;
      cumulative += data[i].value;
      data[i].end = cumulative;
      data[i].class = data[i].value >= 0 ? "positive" : "negative";
    }
    data.push({
      name: "Total",
      end: cumulative,
      start: 0,
      class: "total"
    });

    x.domain(
      data.map(function(d) {
        return d.name;
      })
    );
    y.domain([
      0,
      d3.max(data, function(d) {
        return d.end;
      })
    ]);

    chart
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    chart
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);

    const tooltip = d3
      .select("div.row")
      .append("div")
      .attr("class", "tooltip");

    var bar = chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", function(d) {
        return "bar " + d.class;
      })
      .attr("transform", function(d) {
        return "translate(" + x(d.name) + ",0)";
      });

    bar
      .append("rect")
      .attr("y", function(d) {
        return y(Math.max(d.start, d.end));
      })
      .attr("height", function(d) {
        return Math.abs(y(d.start) - y(d.end));
      })
      .attr("width", x.bandwidth())
      .on("mouseover", function(d, i) {
        d3.event.stopPropagation();
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 1);
        tooltip
          .html("<b>" + dollarFormatter(d.end - d.start) + "</b>")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(2000)
          .style("opacity", 0);
      });

    bar
      .append("text")
      .attr("x", x.bandwidth() / 2)
      .attr("y", function(d) {
        return y(d.end) + 5;
      })
      .attr("dy", function(d) {
        return (d.class === "negative" ? "-" : "") + ".75em";
      })
      .text(function(d) {
        // return dollarFormatter(d.end - d.start);
      });

    bar
      .filter(function(d) {
        return d.class !== "total";
      })
      .append("line")
      .attr("class", "connector")
      .attr("x1", x.bandwidth() + 5)
      .attr("y1", function(d) {
        return y(d.end);
      })
      .attr("x2", x.bandwidth() / (1 - padding) - 5)
      .attr("y2", function(d) {
        return y(d.end);
      });

    // function type(d) {
    //   d.value = +d.value;
    //   return d;
    // }

    function dollarFormatter(n) {
      n = Math.round(n);
      var result = n;
      if (Math.abs(n) > 1000) {
        result = Math.round(n / 1000);
      }
      return result;
    }
  };

  render() {
    return (
      <svg className="ml-2" viewBox="0 0 420 250">
        <g is="x3d" ref={this.anchor} />;
      </svg>
    );
  }
}

export default WaterFallChart;
