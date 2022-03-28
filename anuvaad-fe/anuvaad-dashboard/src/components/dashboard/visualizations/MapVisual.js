import React, { Component } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { DashboardService } from "../../../services/dashboard.service";

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
    // this.updateMapVisual = this.updateMapVisual.bind(this);
    this.anchor = React.createRef();
  }

  componentDidMount() {
    // Initial function to fetch TopoJSON data and convert it into GeoJSON
    // Draw map after data gets loaded

    let { chartData } = this.props;

    let { drillDownId } = this.props;

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
                  this.state.indiaDistrict.features,
                  chartData,
                  drillDownId
                );
              }
            }, 1);
          }
        );
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  loadMap = (states, districts, data, drillDownId) => {
    // Function to draw map after data gets loaded
    let scale = 750;

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

    // let key1 = [
    //   "0",
    //   "1-10",
    //   "11-50",
    //   "51-200",
    //   "201-500",
    //   "501-1000",
    //   "1001-2000",
    //   "2001-5000",
    //   "5000+",
    // ];
    let key2 = [
      "0",
      "1-100",
      "101-1000",
      "1K-5K",
      "5K-25K",
      "25K-100K",
      "1L-2L",
      "2L-5L",
      "500,000+"
    ];
    let key3 = [
      "0",
      "1-100",
      "101-500",
      "501-2000",
      "2K-5K",
      "5K-10K",
      "10K-50K",
      "50K-100K",
      "100,000+"
    ];

    d3.select(this.anchor.current)
      .select("svg")
      .remove();

    const svg = d3.select(this.anchor.current),
      { width, height } = this.props;

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

    const legend = d3.select(this.anchor.current);

    const zoomControl = d3.select(this.anchor.current);

    const tooltip = d3
      .select("div.row")
      .append("div")
      .attr("class", "tooltip");

    let size = 13;

    if (data[0].colorPaletteId === 101) {
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

    if (data[0].colorPaletteId === 102 || data[0].colorPaletteId === 103) {
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
    }

    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on("zoom", function() {
        svg.selectAll("path").attr("transform", d3.event.transform);
      });

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

    selectState
      .append("path")
      // .style("fill", function(d) { return greenPalette[Math.floor(Math.random() * 1.1)]; })
      .style("fill", function(d) {
        return d3.values(data).map(function(m, n) {
          var value = m["plots"];
          let returnValue;
          for (var k = 0; k < value.length; k++) {
            if (d.properties.name === value[k]["name"]) {
              let density = value[k]["value"];
              // console.log(data[0].headerName)
              if (data[0].colorPaletteId === 104) {
                if (density === 0) {
                  returnValue = color1;
                } else if (density >= 1 && density <= 10) {
                  returnValue = color2;
                } else if (density >= 11 && density <= 50) {
                  returnValue = color3;
                } else if (density >= 51 && density <= 200) {
                  returnValue = color4;
                } else if (density >= 201 && density <= 500) {
                  returnValue = color5;
                } else if (density >= 501 && density <= 1000) {
                  returnValue = color6;
                } else if (density >= 1001 && density <= 2000) {
                  returnValue = color7;
                } else if (density >= 2001 && density <= 5000) {
                  returnValue = color8;
                } else if (density >= 5000) {
                  returnValue = color9;
                } else {
                  returnValue = color1;
                }
              } else if (data[0].colorPaletteId === 101) {
                if (density === 0) {
                  returnValue = color1;
                } else if (density >= 1 && density <= 100) {
                  returnValue = color2;
                } else if (density >= 100 && density <= 500) {
                  returnValue = color3;
                } else if (density >= 500 && density <= 2000) {
                  returnValue = color4;
                } else if (density >= 2001 && density <= 5001) {
                  returnValue = color5;
                } else if (density >= 5001 && density <= 10000) {
                  returnValue = color6;
                } else if (density >= 10001 && density <= 50000) {
                  returnValue = color7;
                } else if (density >= 50001 && density <= 100000) {
                  returnValue = color8;
                } else if (density >= 100001) {
                  returnValue = color9;
                } else {
                  returnValue = color1;
                }
              } else if (
                data[0].colorPaletteId === 102 ||
                data[0].colorPaletteId === 103
              ) {
                if (density === 0) {
                  returnValue = color1;
                } else if (density >= 1 && density <= 100) {
                  returnValue = color2;
                } else if (density >= 101 && density <= 1000) {
                  returnValue = color3;
                } else if (density >= 1001 && density <= 5000) {
                  returnValue = color4;
                } else if (density >= 5000 && density <= 25000) {
                  returnValue = color5;
                } else if (density >= 25001 && density <= 100000) {
                  returnValue = color6;
                } else if (density >= 100001 && density <= 200000) {
                  returnValue = color7;
                } else if (density >= 200001 && density <= 500000) {
                  returnValue = color8;
                } else if (density >= 500001) {
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
      .attr("d", path)
      .style("pointer-events", "auto")
      .on("mouseover", function(d) {
        d3.event.stopPropagation();
        return d3.values(data).map(function(k, v) {
          var plots = k["plots"];
          for (var i = 0; i < plots.length; i++) {
            if (d.properties.name === plots[i]["name"]) {
              tooltip
                .transition()
                .duration(200)
                .style("opacity", 1);
              tooltip
                .html(
                  "<b>" +
                    d.properties.name +
                    "</b>" +
                    "<br />" +
                    "<p>" +
                    data[0].headerName +
                    ": " +
                    Math.round(plots[i]["value"] * 100) / 100 +
                    "</p>"
                )
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY - 28 + "px");
            }
          }
          return null;
        });
      })
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(2000)
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
        svg.call(zoom.transform, d3.zoomIdentity.scale(1));
        svg.call(zoom).on("wheel.zoom", null);
      })
      .on("click", function(d) {
        tooltip
          .transition()
          .duration(1000)
          .style("opacity", 0);
        d3.event.stopPropagation();
        let newData = d;
        return getVisualData(newData);
      });
    // .on("click", function(d) {
    //     if(d.properties.name !== undefined) {
    //       let selectedLabel = {
    //         labels: [],
    //       }
    //       selectedLabel.labels.push(d.properties.name);
    //       localStorage.setItem("label", selectedLabel.labels);
    //       this.updateMapVisual();
    //     }
    // });
    function getVisualData(newData) {
      if (drillDownId !== "none" && drillDownId !== undefined) {
        localStorage.setItem("selectedState", newData.properties.name);
        DashboardService.getData(drillDownId).then(
          response => {
            svg.selectAll("*").remove();
            localStorage.removeItem("selectedState");
            return updateVisuals(newData, response.responseData.data);
          },
          error => {}
        );
      }
    }

    function updateVisuals(newData, drilldownData) {
      let tempArray = [];
      let newArray = [];
      tempArray.push(newData);
      selectState.exit().remove();
      // console.log(tempArray[0].properties.name);

      d3.values(districts).map(function(i, k) {
        // console.log(i.properties.sn);
        if (tempArray[0].properties.name === i.properties.sn) {
          newArray.push(i);
        }
        return newArray;
      });

      let districtKey1 = [
        "0",
        "1-5",
        "6-10",
        "11-20",
        "21-50",
        "51-100",
        "101-200",
        "201-500",
        "501+"
      ];
      let districtKey2 = [
        "0",
        "1-50",
        "50-100",
        "101-200",
        "201-500",
        "501-1000",
        "1K-2K",
        "2K-5K",
        "5001+"
      ];
      let districtKey3 = [
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

      var bounds = d3.geoPath().bounds(newData),
        center = d3.geoPath().centroid(newData);

      var distance = d3.geoDistance(bounds[0], bounds[1]),
        scale = height / distance / Math.sqrt(2);

      var projection = d3
        .geoMercator()
        .scale(scale)
        .center(center)
        .translate([width / 2, height / 2]);

      var path = d3.geoPath(projection);

      var selectedState = svg
        .selectAll("g > .selectState")
        .data(newArray)
        .enter()
        .append("g")
        .attr("class", "district");

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

      if (drilldownData[0].colorPaletteId === 201) {
        legend
          .selectAll("squares")
          .data(districtKey3)
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
          .data(districtKey3)
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

      if (
        drilldownData[0].colorPaletteId === 202 ||
        drilldownData[0].colorPaletteId === 203
      ) {
        legend
          .selectAll("squares")
          .data(districtKey2)
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
          .data(districtKey2)
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
      } else if (drilldownData[0].colorPaletteId === 204) {
        legend
          .selectAll("squares")
          .data(districtKey1)
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
          .data(districtKey1)
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

      var x = 0,
        y = 0;
      var centroid = path.centroid(newData);
      x = width / 2 - centroid[0];
      y = height / 2 - centroid[1];
      x = x - 10;
      y = y + 35;

      selectedState
        .transition()
        .duration(750)
        .attr("transform", "translate(" + x + "," + y + ")");

      selectedState
        .append("path")
        .style("fill", function(d) {
          return d3.values(drilldownData).map(function(m, n) {
            var value = m["plots"];
            let returnValue;
            // console.log(value);
            // console.log("Density: "+value);
            for (var k = 0; k < value.length; k++) {
              if (d.properties.dn === value[k]["name"]) {
                let density = value[k]["value"];
                // console.log(data[0].headerName)
                if (
                  drilldownData[0].colorPaletteId === 202 ||
                  drilldownData[0].colorPaletteId === 203
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
                } else if (drilldownData[0].colorPaletteId === 204) {
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
                } else if (drilldownData[0].colorPaletteId === 201) {
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
          return d3.values(drilldownData).map(function(k, v) {
            var plots = k["plots"];
            for (var i = 0; i < plots.length; i++) {
              if (d.properties.dn === plots[i]["name"]) {
                tooltip
                  .transition()
                  .duration(200)
                  .style("opacity", 1);
                tooltip
                  .html(
                    "<b>" +
                      d.properties.sn +
                      "</b>" +
                      "<br />" +
                      "<p>" +
                      plots[i]["name"] +
                      ": " +
                      Math.round(plots[i]["value"] * 100) / 100 +
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
          // svg.call(zoomDistrict).on("wheel.zoom", null);
        })
        .on("dblclick", function(d) {
          // svg.call(zoomDistrict);
        })
        // .on("click", function (d) {
        //   svg.call(zoom).on("wheel.zoom", null);
        //   svg.call(zoom.transform, d3.zoomIdentity.scale(1));
        // })
        .on("contextmenu", function(d) {
          d3.event.preventDefault();
          // svg.call(zoomDistrict).on("wheel.zoom", null);
          // svg.call(zoomDistrict.transform, d3.zoomIdentity.scale(1));
          svg.selectAll("*").remove();

          var projection = d3
            .geoMercator()
            .center([83, 23])
            .scale(750)
            .translate([width / 2, height / 2]);

          var path = d3.geoPath(projection);

          var callbackState = svg
            .selectAll("g")
            .data(states)
            .enter()
            .append("g")
            .attr("class", "state");

          // const legend = d3.select(this.anchor.current);

          let size = 13;

          if (data[0].colorPaletteId === 101) {
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

          if (
            data[0].colorPaletteId === 102 ||
            data[0].colorPaletteId === 103
          ) {
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
          }

          // const tooltip = d3
          //   .select("body")
          //   .append("div")
          //   .attr("class", "tooltip");

          // const zoom = d3
          //   .zoom()
          //   .scaleExtent([1, 8])
          //   .on("zoom", function () {
          //     svg.selectAll("path").attr("transform", d3.event.transform);
          //   });

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

          callbackState
            .append("path")
            .style("fill", function(d) {
              return d3.values(data).map(function(m, n) {
                var value = m["plots"];
                let returnValue;
                for (var k = 0; k < value.length; k++) {
                  if (d.properties.name === value[k]["name"]) {
                    let density = value[k]["value"];

                    if (data[0].colorPaletteId === 104) {
                      if (density === 0) {
                        returnValue = color1;
                      } else if (density >= 1 && density <= 10) {
                        returnValue = color2;
                      } else if (density >= 11 && density <= 50) {
                        returnValue = color3;
                      } else if (density >= 51 && density <= 200) {
                        returnValue = color4;
                      } else if (density >= 201 && density <= 500) {
                        returnValue = color5;
                      } else if (density >= 501 && density <= 1000) {
                        returnValue = color6;
                      } else if (density >= 1001 && density <= 2000) {
                        returnValue = color7;
                      } else if (density >= 2001 && density <= 5000) {
                        returnValue = color8;
                      } else if (density >= 5000) {
                        returnValue = color9;
                      } else {
                        returnValue = color1;
                      }
                    } else if (data[0].colorPaletteId === 101) {
                      if (density === 0) {
                        returnValue = color1;
                      } else if (density >= 1 && density <= 100) {
                        returnValue = color2;
                      } else if (density >= 100 && density <= 500) {
                        returnValue = color3;
                      } else if (density >= 500 && density <= 2000) {
                        returnValue = color4;
                      } else if (density >= 2001 && density <= 5001) {
                        returnValue = color5;
                      } else if (density >= 5001 && density <= 10000) {
                        returnValue = color6;
                      } else if (density >= 10001 && density <= 50000) {
                        returnValue = color7;
                      } else if (density >= 50001 && density <= 100000) {
                        returnValue = color8;
                      } else if (density >= 100001) {
                        returnValue = color9;
                      } else {
                        returnValue = color1;
                      }
                    } else if (
                      data[0].colorPaletteId === 102 ||
                      data[0].colorPaletteId === 103
                    ) {
                      if (density === 0) {
                        returnValue = color1;
                      } else if (density >= 1 && density <= 100) {
                        returnValue = color2;
                      } else if (density >= 101 && density <= 1000) {
                        returnValue = color3;
                      } else if (density >= 1001 && density <= 5000) {
                        returnValue = color4;
                      } else if (density >= 5000 && density <= 25000) {
                        returnValue = color5;
                      } else if (density >= 25001 && density <= 100000) {
                        returnValue = color6;
                      } else if (density >= 100001 && density <= 200000) {
                        returnValue = color7;
                      } else if (density >= 200001 && density <= 500000) {
                        returnValue = color8;
                      } else if (density >= 500001) {
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
            .attr("d", path)
            .style("pointer-events", "auto")
            .on("mouseover", function(d) {
              d3.event.stopPropagation();
              return d3.values(data).map(function(k, v) {
                var plots = k["plots"];
                for (var i = 0; i < plots.length; i++) {
                  if (d.properties.name === plots[i]["name"]) {
                    tooltip
                      .transition()
                      .duration(200)
                      .style("opacity", 1);
                    tooltip
                      .html(
                        "<b>" +
                          d.properties.name +
                          "</b>" +
                          "<br />" +
                          "<p>" +
                          data[0].headerName +
                          ": " +
                          Math.round(plots[i]["value"] * 100) / 100 +
                          "</p>"
                      )
                      .style("left", d3.event.pageX + "px")
                      .style("top", d3.event.pageY - 28 + "px");
                  }
                }
                return null;
              });
            })
            .on("mouseout", function(d) {
              tooltip
                .transition()
                .duration(2000)
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
              svg.call(zoom.transform, d3.zoomIdentity.scale(1));
              svg.call(zoom).on("wheel.zoom", null);
            })
            .on("click", function(d) {
              d3.event.stopPropagation();
              svg.selectAll("*").remove();
              let newData = d;
              return getVisualData(newData);
            });
        });
    }
  };

  // updateMapVisual = () => {
  //   this.setState({
  //     trigger: true
  //   })
  //   this.props.pathName.history.push({pathName: "/dashboards", state: {trigger: this.state.trigger}});
  //   setTimeout(() => {this.props.pathName.history.push({pathName: "/dashboards", state: {trigger: this.state.trigger}});}, 500)
  // }

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

export default MapVisual;
