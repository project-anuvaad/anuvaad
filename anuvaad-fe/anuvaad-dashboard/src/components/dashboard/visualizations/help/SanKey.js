import React from "react";
import * as d3 from "d3";

import {
  sankey as d3Sankey,
  sankeyLinkHorizontal as d3SLHorizontal
} from "d3-sankey";

class SanKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
    this.loadChart = this.loadChart.bind(this);
    this.anchor = React.createRef();
  }

  componentDidMount() {
    fetch("/json/SankeyData.json", {
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
    d3.select(this.anchor.current)
      .select("svg")
      .remove();

    var svg = d3.select(this.anchor.current),
      width = 420,
      height = 200;

    var formatNumber = d3.format(",.0f"),
      format = function(d) {
        return formatNumber(d) + " TWh";
      };
    // color = d3.scaleOrdinal(d3.schemeCategory10);

    var sankey = d3Sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 1],
        [width - 1, height - 6]
      ]);

    var link = svg
      .append("g")
      .attr("class", "links")
      .attr("fill", "none")
      .attr("stroke", "darkgrey")
      .attr("stroke-opacity", 0.2)
      .selectAll("path");

    var node = svg
      .append("g")
      .attr("class", "nodes")
      .attr("font-size", 10)
      .selectAll("g");

    var graph;

    graph = sankey(data);

    // console.log(graph);

    link = link
      .data(data.links)
      .enter()
      .append("path")
      .attr("d", d3SLHorizontal())
      .attr("stroke-width", function(d) {
        return Math.max(1, d.width);
      });

    link.append("title").text(function(d) {
      return d.source.name + " → " + d.target.name + "\n" + format(d.value);
    });

    node = node
      .data(data.nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag()
          .subject(function(d) {
            return d;
          })
          .on("start", function() {
            this.parentNode.appendChild(this);
          })
          .on("drag", function(d) {
            var rectY = d3
              .select(this)
              .select("rect")
              .attr("y");

            d.y0 = d.y0 + d3.event.dy;

            var yTranslate = d.y0 - rectY;

            d3.select(this).attr(
              "transform",
              "translate(0," + yTranslate + ")"
            );

            sankey.update(graph);
            link.attr("d", d3SLHorizontal());
          })
      );

    node
      .append("rect")
      .attr("x", function(d) {
        return d.x0;
      })
      .attr("y", function(d) {
        return d.y0;
      })
      .attr("height", function(d) {
        return d.y1 - d.y0;
      })
      .attr("width", function(d) {
        return d.x1 - d.x0;
      })
      .attr("fill", function(d) {
        return "#2b98ff";
        // return color(d.name.replace(/ .*/, ""));
      });
    // .attr("stroke", "#000");

    node
      .append("text")
      .attr("x", function(d) {
        return d.x0 - 6;
      })
      .attr("y", function(d) {
        return (d.y1 + d.y0) / 2;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(d) {
        return d.name;
      })
      .filter(function(d) {
        return d.x0 < width / 2;
      })
      .attr("x", function(d) {
        return d.x1 + 6;
      })
      .attr("text-anchor", "start");

    node.append("title").text(function(d) {
      return d.name + "\n" + format(d.value);
    });
  };

  render() {
    return (
      <svg className="ml-2" viewBox="0 0 420 215">
        <g ref={this.anchor} />;
      </svg>
    );
  }
}

export default SanKey;
