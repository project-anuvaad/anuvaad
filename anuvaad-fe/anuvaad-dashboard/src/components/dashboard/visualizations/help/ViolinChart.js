import React from "react";
import * as d3 from "d3";

class ViolinChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
    this.loadChart = this.loadChart.bind(this);
    this.anchor = React.createRef();
  }

  componentDidMount() {
    fetch("/json/ViolinData.json", {
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
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 300 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

    var svg = d3
      .select(this.anchor.current)
      // .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      // .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3
      .scaleLinear()
      .domain([3.5, 8]) // Note that here the Y scale is set manually
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(["Data 1", "Data 2", "Data 3"])
      .padding(0.05); // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Features of the histogram
    var histogram = d3
      .histogram()
      .domain(y.domain())
      .thresholds(y.ticks(20)) // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
      .value(d => d);

    // Compute the binning for each group of the dataset
    var sumstat = d3
      .nest() // nest function allows to group the calculation per level of a factor
      .key(function(d) {
        return d.Species;
      })
      .rollup(function(d) {
        // For each key..
        var input = d.map(function(g) {
          return g.Sepal_Length;
        }); // Keep the variable called Sepal_Length
        var bins = histogram(input); // And compute the binning on it.
        return bins;
      })
      .entries(data);

    // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    var maxNum = 0;
    for (let i in sumstat) {
      var allBins = sumstat[i].value;
      var lengths = allBins.map(function(a) {
        return a.length;
      });
      var longuest = d3.max(lengths);
      if (longuest > maxNum) {
        maxNum = longuest;
      }
    }
    const tooltip = d3
      .select("div.row")
      .append("div")
      .attr("class", "tooltip");

    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    var xNum = d3
      .scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-maxNum, maxNum]);

    // Add the shape to this svg!
    svg
      .selectAll("svg")
      .data(sumstat)
      .enter() // So now we are working group per group
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + x(d.key) + " ,0)";
      }) // Translation on the right to be at the group position
      .append("path")
      .datum(function(d) {
        return d.value;
      }) // So now we are working bin per bin
      .style("stroke", "none")
      .style("fill", "#2b98ff")
      .attr(
        "d",
        d3
          .area()
          .x0(function(d) {
            return xNum(-d.length);
          })
          .x1(function(d) {
            return xNum(d.length);
          })
          .y(function(d) {
            return y(d.x0);
          })
          .curve(d3.curveCatmullRom) // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
      )
      .on("mouseover", function(d, i) {
        d3.event.stopPropagation();
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 1);
        tooltip
          .html("<b>" + d[i].x1 + "</b>")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(2000)
          .style("opacity", 0);
      });
  };

  render() {
    return (
      <svg className="ml-2" viewBox="0 0 420 250">
        <g ref={this.anchor} />;
      </svg>
    );
  }
}

export default ViolinChart;
