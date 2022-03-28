import React, { Component } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

class MapVisual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indiaData: null,
      indiaFeature: null,
      indiaDistrict: null,
      trigger: ""
    };
    this.loadMap = this.loadMap.bind(this);
    this.anchor = React.createRef();
  }

  componentDidMount() {
    // Initial function to fetch TopoJSON data and convert it into GeoJSON
    // Draw map after data gets loaded

    if (localStorage.getItem("selectedState")) {
      localStorage.removeItem("selectedState");
    }

    fetch("/json/IndiaDistricts.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(messages => {
        this.setState(
          {
            indiaData: topojson.feature(messages, messages.objects.data),
            indiaDistrict: topojson.feature(
              messages,
              messages.objects.map_with_districts
            )
          },
          () => {
            setTimeout(() => {
              if (
                this.state.indiaData.features &&
                this.state.indiaDistrict.features
              ) {
                this.loadMap(
                  this.state.indiaData.features,
                  this.state.indiaDistrict.features
                );
              }
            }, 1);
          }
        );
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  loadMap = (states, districts) => {
    // Function to draw map after data gets loaded
    let scale = 400;

    d3.select(this.anchor.current)
      .select("svg")
      .remove();

    let width = 420;
    let height = 250;

    const svg = d3.select(this.anchor.current);

    var projection = d3
      .geoMercator()
      .center([83, 23])
      .scale(scale)
      .translate([width / 2, height / 2]);

    var path = d3.geoPath(projection);

    var selectState = svg
      .selectAll("g")
      .data(states)
      .enter()
      .append("g")
      .attr("class", "state");

    const tooltip = d3
      .select("div.row")
      .append("div")
      .attr("class", "tooltip");

    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on("zoom", function() {
        svg.selectAll("path").attr("transform", d3.event.transform);
      });

    selectState
      .append("path")
      .style("fill", function(d) {
        return d3.interpolateBlues(d3.randomUniform()());
      })
      .attr("d", path)
      .style("pointer-events", "auto")
      .on("mouseover", function(d) {
        d3.event.stopPropagation();
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 1);
        tooltip
          .html("<b>" + d.properties.name + "</b>")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");

        return null;
      })
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(2000)
          .style("opacity", 0);
      })
      .on("mouseleave", function(d) {
        svg.call(zoom).on("wheel.zoom", null);
      })
      .on("dblclick", function(d) {
        svg.call(zoom);
      })
      .on("contextmenu", function(d) {
        d3.event.preventDefault();
        svg.call(zoom.transform, d3.zoomIdentity.scale(1));
        svg.call(zoom).on("wheel.zoom", null);
      })
      .on("click", function(d) {
        tooltip
          .transition()
          .duration(1000)
          .style("opacity", 0);
        d3.event.stopPropagation();
      });
  };

  render() {
    const { indiaData } = this.state;

    if (!indiaData) {
      return null;
    }

    return (
      <svg className="ml-2" viewBox="0 0 420 250">
        <g ref={this.anchor} />;
      </svg>
    );
  }
}

export default MapVisual;
