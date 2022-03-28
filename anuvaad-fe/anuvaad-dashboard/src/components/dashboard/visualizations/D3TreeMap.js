import React from "react";
import * as d3 from "d3";
import { Library } from "@observablehq/stdlib";
import _ from "lodash";

const library = new Library();

class D3TreeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
    this.loadChart = this.loadChart.bind(this);
    this.anchor = React.createRef();
  }

  componentDidMount() {
    let { chartData } = this.props;
    let data = [];
    let child = [];

    _.forEach(chartData, function(k, v) {
      var plots = k["plots"];
      for (var i = 0; i < plots.length; i++) {
        child.push({
          name: plots[i]["name"],
          children: [{ name: plots[i]["name"], value: plots[i]["value"] }]
        });
      }
    });
    data.push({ name: chartData[0].headerName, children: child });

    if (data[0]) {
      this.loadChart(data[0]);
    }
  }

  loadChart = data => {
    d3.select(this.anchor.current)
      .select("svg")
      .remove();

    let width = 954;
    let height = 924;

    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([0, height]);

    const svg = d3
      .select(this.anchor.current)
      // .attr("viewBox", [0.5, -30.5, width, height + 30])
      .style("font", "30px Lato");

    const color = d3.scaleOrdinal([
      "#0074FF",
      "#0074FF",
      "#3AA5FF",
      "#F96A00",
      "#F96A00",
      "#E6194B",
      "#3CB44B",
      "#FFCD22",
      "#4364D8",
      "#F58230",
      "#911DB4",
      "#42D4F4",
      "#469990",
      "#E6BDFF",
      "#9A6324",
      "#FFFAC8",
      "#800000",
      "#AAFFC3",
      "#808001"
    ]);

    function tile(node, x0, y0, x1, y1) {
      d3.treemapBinary(node, 0, 0, width, height);
      for (const child of node.children) {
        child.x0 = x0 + (child.x0 / width) * (x1 - x0);
        child.x1 = x0 + (child.x1 / width) * (x1 - x0);
        child.y0 = y0 + (child.y0 / height) * (y1 - y0);
        child.y1 = y0 + (child.y1 / height) * (y1 - y0);
      }
    }

    let group = svg.append("g").call(render, treemap(data));

    function treemap(data) {
      return d3.treemap().tile(tile)(
        d3
          .hierarchy(data)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value)
      );
    }

    function render(group, root) {
      if (root.children !== undefined) {
        const node = group
          .selectAll("g")
          .data(root.children.concat(root))
          .join("g");

        node
          .filter(d => (d === root ? d.parent : d.children))
          .attr("cursor", "pointer")
          .on("click", d => (d === root ? zoomout(root) : zoomin(d)));

        let format = d3.format(",d");

        node.append("title").text(
          d =>
            `${d
              .ancestors()
              .reverse()
              .map(d => d.data.name)
              .join("/")}\n${format(d.value)}`
        );

        node
          .append("rect")
          .attr("id", d => (d.leafUid = library.DOM.uid("leaf")).id)
          .attr("fill", d =>
            d === root
              ? "#fff"
              : d.children
              ? color(d.parent.data.name)
              : color(d.parent.data.name)
          )
          .attr("stroke", "#fff");

        node
          .append("clipPath")
          .attr("id", d => (d.clipUid = library.DOM.uid("clip")).id)
          .append("use")
          .attr("xlink:href", d => d.leafUid.href);

        node
          .append("text")
          .attr("clip-path", d => d.clipUid)
          .attr(
            "font-size",
            (d, i, nodes) =>
              // console.log(`${(i === nodes.length) * 0.3 + 1.1 + i}em`)
              // console.log(`${nodes.length-- / 10}em`)
              // `${nodes.length-- / 10}em`

              "0.7em"
          )
          .attr("font-weight", d => (d === root ? "bold" : null))
          .selectAll("tspan")
          .data(d =>
            d === data
              ? d
                  .ancestors()
                  .reverse()
                  .map(d => d.data.name)
                  .join("/")
                  .split(/(?=[A-Z][^A-Z])/g)
                  .concat(format(d.value))
              : d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(format(d.value))
          )
          .join("tspan")
          .attr("x", 3)
          .attr(
            "y",
            (d, i, nodes) =>
              `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
          )
          .attr("fill-opacity", (d, i, nodes) =>
            i === nodes.length - 1 ? 0.7 : null
          )
          .attr("font-weight", (d, i, nodes) =>
            i === nodes.length - 1 ? "normal" : null
          )
          .text(d => d);

        group.call(position, root);
      }
    }

    function position(group, root) {
      group
        .selectAll("g")
        .attr("transform", d =>
          d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`
        )
        .select("rect")
        .attr("width", d => (d === root ? width : x(d.x1) - x(d.x0)))
        .attr("height", d => (d === root ? 30 : y(d.y1) - y(d.y0)));
    }

    // When zooming in, draw the new nodes on top, and fade them in.
    function zoomin(d) {
      const group0 = group.attr("pointer-events", "none");
      const group1 = (group = svg.append("g").call(render, d));

      x.domain([d.x0, d.x1]);
      y.domain([d.y0, d.y1]);

      svg
        .transition()
        .duration(750)
        .call(t =>
          group0
            .transition(t)
            .remove()
            .call(position, d.parent)
        )
        .call(t =>
          group1
            .transition(t)
            .attrTween("opacity", () => d3.interpolate(0, 1))
            .call(position, d)
        );
    }

    // When zooming out, draw the old nodes on top, and fade them out.
    function zoomout(d) {
      const group0 = group.attr("pointer-events", "none");
      const group1 = (group = svg.insert("g", "*").call(render, d.parent));

      x.domain([d.parent.x0, d.parent.x1]);
      y.domain([d.parent.y0, d.parent.y1]);

      svg
        .transition()
        .duration(750)
        .call(t =>
          group0
            .transition(t)
            .remove()
            .attrTween("opacity", () => d3.interpolate(1, 0))
            .call(position, d)
        )
        .call(t => group1.transition(t).call(position, d.parent));
    }

    return svg.node();
  };

  render() {
    return (
      <svg className="ml-2" viewBox="0.5,-30.5,954,954">
        <g ref={this.anchor} />;
      </svg>
    );
  }
}

export default D3TreeMap;
