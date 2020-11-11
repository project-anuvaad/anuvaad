import React, { Component } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

class DistrictVisual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indiaData: null,
      indiaDistrict: null
    };
    this.loadMap = this.loadMap.bind(this);
    this.anchor = React.createRef();
  }

  componentDidMount() {
    // Initial function to fetch TopoJSON data and convert it into GeoJSON
    // Draw map after data gets loaded

    let { chartData } = this.props;

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
                  this.state.indiaDistrict.features,
                  chartData
                );
                // console.log(this.state.indiaData)
              }
            }, 1);
          }
        );
      });
  }

  loadMap = (states, districts, data) => {
    // console.log(data);
    // Function to draw map after data gets loader

    let scale = 750;
    let bluePalette = [
      "#E8F0FA",
      "#d5e4f6",
      "#c0d6f1",
      " #82aee3",
      "#B8CCE8",
      "#9fbae0",
      "#6590cd",
      "#3e75c1",
      "#9CBBE7",
      " #84abe1",
      "#5b8fd7",
      "#3273cd",
      "#7FADEE",
      "#5A9AF5",
      "#619aea",
      "#347ee5",
      "#1a64cb",
      "#2A7EF5",
      "#0b6cf4",
      "#0957c3",
      "#074192",
      "#1453CB",
      "#1043a2",
      "#0b3074",
      "#09265d",
      "#E8F0FA",
      "#d5e4f6",
      "#c0d6f1",
      " #82aee3",
      "#B8CCE8"
    ];

    // Color ranges
    let color1 = ["#DDDEE0"];
    let color2 = ["#FFEAC9"];
    let color3 = ["#F3D6A8"];
    let color4 = ["#FBBA8A"];
    let color5 = ["#F29059"];
    let color6 = ["#E76A49"];
    let color7 = ["#D23B29"];
    let color8 = ["#AB0916"];
    let color9 = ["#7A030E"];

    let key1 = [
      "0",
      "1-5",
      "6-10",
      "11-20",
      "21-50",
      "51-100",
      "101-200",
      "201-500",
      "500+"
    ];
    let key2 = [
      "0",
      "1-50",
      "50-100",
      "101-200",
      "201-500",
      "501-1000",
      "1K-2K",
      "2K-5K",
      "5,000+"
    ];
    let key3 = [
      "0",
      "1-10",
      "11-50",
      "51-100",
      "101-500",
      "501-1000",
      "1001-2000",
      "2001-5000",
      "5001+"
    ];

    d3.select(this.anchor.current)
      .select("svg")
      .remove();

    const svg = d3.select(this.anchor.current),
      { width, height } = this.props;

    //  svg.call(d3.zoom()
    // .scaleExtent([1, 50])
    // .on("zoom", function() {
    //   svg.attr("transform", d3.event.transform)
    // }));

    const projection = d3
      .geoMercator()
      .center([83, 23])
      .scale(scale)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath(projection);

    const selectState = svg
      .selectAll("g")
      .data(states)
      .enter()
      .append("g")
      .attr("class", "stateOne");

    const selectDistrict = svg
      .selectAll("g > .selectState")
      .data(districts)
      .enter()
      .append("g")
      .attr("class", "district");

    const tooltip = d3
      .select("div.row")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on("zoom", function() {
        svg.selectAll("path").attr("transform", d3.event.transform);
      });

    const legend = d3.select(this.anchor.current);

    const zoomControl = d3.select(this.anchor.current);

    let size = 13;

    zoomControl
      .append("rect")
      .attr("id", "zoomIn")
      .attr("width", 20)
      .attr("height", 20)
      .attr("x", 380)
      .attr("y", 0)
      .on("click", function(d) {
        svg.transition().call(zoom.scaleBy, 2);
      });

    zoomControl
      .append("rect")
      .attr("id", "zoomOut")
      .attr("width", 20)
      .attr("height", 20)
      .attr("x", 380)
      .attr("y", 20)
      .on("click", function(d) {
        svg.transition().call(zoom.scaleBy, 0.5);
      });

    zoomControl
      .append("text")
      .attr("id", "zoomInBtn")
      .attr("x", 386)
      .attr("y", 15)
      .on("click", function(d) {
        svg.transition().call(zoom.scaleBy, 2);
      })
      .text(function(d) {
        return "+";
      });

    zoomControl
      .append("text")
      .attr("id", "zoomOutBtn")
      .attr("x", 387.5)
      .attr("y", 33)
      .on("click", function(d) {
        svg.transition().call(zoom.scaleBy, 0.5);
      })
      .text(function(d) {
        return "-";
      });

    if (data[0].colorPaletteId === 201) {
      legend
        .selectAll("squares")
        .data(key3)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("x", 300)
        .attr("y", function(d, i) {
          return i * (size + 5);
        })
        .attr("width", size)
        .attr("height", 20)
        .attr("stroke", "black")
        .attr("stroke-width", "0.5px")
        .style("fill", function(d, i) {
          if (i === 0) {
            return color1;
          } else if (i === 1) {
            return color2;
          } else if (i === 2) {
            return color3;
          } else if (i === 3) {
            return color4;
          } else if (i === 4) {
            return color5;
          } else if (i === 5) {
            return color6;
          } else if (i === 6) {
            return color7;
          } else if (i === 7) {
            return color8;
          } else if (i === 8) {
            return color9;
          }
        });
      legend
        .selectAll("labels")
        .data(key3)
        .enter()
        .append("text")
        .attr("x", 300 + size * 1.2)
        .attr("y", function(d, i) {
          return 5 + i * (size + 5) + size / 2;
        })
        .text(function(d) {
          return d;
        })
        .attr("class", "textLabels")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    }

    if (data[0].colorPaletteId === 202 || data[0].colorPaletteId === 203) {
      legend
        .selectAll("squares")
        .data(key2)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("x", 300)
        .attr("y", function(d, i) {
          return i * (size + 5);
        })
        .attr("width", size)
        .attr("height", 20)
        .attr("stroke", "black")
        .attr("stroke-width", "0.5px")
        .style("fill", function(d, i) {
          if (i === 0) {
            return color1;
          } else if (i === 1) {
            return color2;
          } else if (i === 2) {
            return color3;
          } else if (i === 3) {
            return color4;
          } else if (i === 4) {
            return color5;
          } else if (i === 5) {
            return color6;
          } else if (i === 6) {
            return color7;
          } else if (i === 7) {
            return color8;
          } else if (i === 8) {
            return color9;
          }
        });

      legend
        .selectAll("labels")
        .data(key2)
        .enter()
        .append("text")
        .attr("x", 300 + size * 1.2)
        .attr("y", function(d, i) {
          return 5 + i * (size + 5) + size / 2;
        })
        .text(function(d) {
          return d;
        })
        .attr("class", "textLabels")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    } else if (data[0].colorPaletteId === 204) {
      legend
        .selectAll("squares")
        .data(key1)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("x", 300)
        .attr("y", function(d, i) {
          return i * (size + 5);
        })
        .attr("width", size)
        .attr("height", 20)
        .attr("stroke", "black")
        .attr("stroke-width", "0.5px")
        .style("fill", function(d, i) {
          if (i === 0) {
            return color1;
          } else if (i === 1) {
            return color2;
          } else if (i === 2) {
            return color3;
          } else if (i === 3) {
            return color4;
          } else if (i === 4) {
            return color5;
          } else if (i === 5) {
            return color6;
          } else if (i === 6) {
            return color7;
          } else if (i === 7) {
            return color8;
          } else if (i === 8) {
            return color9;
          }
        });

      legend
        .selectAll("labels")
        .data(key1)
        .enter()
        .append("text")
        .attr("x", 300 + size * 1.2)
        .attr("y", function(d, i) {
          return 5 + i * (size + 5) + size / 2;
        })
        .text(function(d) {
          return d;
        })
        .attr("class", "textLabels")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    }

    selectState
      .append("path")
      .style("fill", function(d) {
        return bluePalette[Math.floor(1)];
      })
      .attr("d", path)
      .style("pointer-events", "auto")

      // .attr('stroke', '#434343')
      // .attr('stroke-width', function(d) { return (d.properties.area * 5); })
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(2000)
          .style("opacity", 0);
      });

    selectDistrict
      .append("path")

      // .style("fill", function(d) { return bluePalette[Math.floor(Math.random() * 5)]; })
      .style("fill", function(d) {
        // for(var i=0; i< data.length;i++){
        //   for(var j=0 ;j< data[i].plots.length; j++){
        //     if(d.properties.NAME_2 === data[i].plots[j].name){
        //       return bluePalette[Math.floor(data[i].plots[j].value)]
        //     }
        //   }
        // }
        return d3.values(data).map(function(m, n) {
          var value = m["plots"];
          let returnValue;
          // console.log("Density: "+value);
          for (var k = 0; k < value.length; k++) {
            if (
              d.properties.dn === value[k]["name"] &&
              d.properties.sn === value[k]["parentName"]
            ) {
              let density = value[k]["value"];
              // console.log(data[0].headerName)
              if (
                data[0].colorPaletteId === 202 ||
                data[0].colorPaletteId === 203
              ) {
                if (density === 0) {
                  returnValue = color1;
                } else if (density >= 1 && density <= 50) {
                  returnValue = color2;
                } else if (density >= 51 && density <= 100) {
                  returnValue = color3;
                } else if (density >= 101 && density <= 200) {
                  returnValue = color4;
                } else if (density >= 201 && density <= 500) {
                  returnValue = color5;
                } else if (density >= 501 && density <= 1000) {
                  returnValue = color6;
                } else if (density >= 1001 && density <= 2000) {
                  returnValue = color7;
                } else if (density >= 2001 && density <= 5000) {
                  returnValue = color8;
                } else if (density >= 5001) {
                  returnValue = color9;
                } else {
                  returnValue = color1;
                }
              } else if (data[0].colorPaletteId === 204) {
                if (density === 0) {
                  returnValue = color1;
                } else if (density >= 1 && density <= 5) {
                  returnValue = color2;
                } else if (density >= 6 && density <= 10) {
                  returnValue = color3;
                } else if (density >= 11 && density <= 20) {
                  returnValue = color4;
                } else if (density >= 21 && density <= 50) {
                  returnValue = color5;
                } else if (density >= 51 && density <= 100) {
                  returnValue = color6;
                } else if (density >= 101 && density <= 200) {
                  returnValue = color7;
                } else if (density >= 201 && density <= 500) {
                  returnValue = color8;
                } else if (density >= 501) {
                  returnValue = color9;
                } else {
                  returnValue = color1;
                }
              } else if (data[0].colorPaletteId === 201) {
                if (density === 0) {
                  returnValue = color1;
                } else if (density >= 1 && density <= 10) {
                  returnValue = color2;
                } else if (density >= 11 && density <= 50) {
                  returnValue = color3;
                } else if (density >= 51 && density <= 100) {
                  returnValue = color4;
                } else if (density >= 101 && density <= 500) {
                  returnValue = color5;
                } else if (density >= 501 && density <= 1000) {
                  returnValue = color6;
                } else if (density >= 1001 && density <= 2000) {
                  returnValue = color7;
                } else if (density >= 2001 && density <= 5000) {
                  returnValue = color8;
                } else if (density >= 5001) {
                  returnValue = color9;
                } else {
                  returnValue = color1;
                }
              }
            }
          }
          return returnValue;
        });
      })
      .on("mouseover", function(d) {
        d3.event.stopPropagation();
        return d3.values(data).map(function(k, v) {
          var plots = k["plots"];
          for (var i = 0; i < plots.length; i++) {
            if (
              d.properties.dn === plots[i]["name"] &&
              d.properties.sn === plots[i]["parentName"]
            ) {
              tooltip
                .transition()
                .duration(200)
                .style("opacity", 1);
              tooltip
                .html(
                  "<b>" +
                    plots[i]["parentName"] +
                    "</b>" +
                    "<br />" +
                    "<p>" +
                    plots[i]["name"] +
                    ": " +
                    plots[i]["value"] +
                    "</p>"
                )
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY - 28 + "px");
            }
          }
          return null;
        });
      })
      .attr("d", path)
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(2500)
          .style("opacity", 0);
        // svg.call(zoom).on("wheel.zoom", null);
      })
      .on("mouseleave", function(d) {
        svg.call(zoom).on("wheel.zoom", null);
      })
      .on("dblclick", function(d) {
        svg.call(zoom);
      })
      .on("contextmenu", function(d) {
        d3.event.preventDefault();
        svg.call(zoom).on("wheel.zoom", null);
        svg.call(zoom.transform, d3.zoomIdentity.scale(1));
      });
  };

  render() {
    const { indiaData } = this.state;

    if (!indiaData) {
      return null;
    }

    return (
      <svg className="ml-2" viewBox="0 0 420 500">
        <g ref={this.anchor} />;
      </svg>
    );
  }
}

export default DistrictVisual;
