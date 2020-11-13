import React, { Component } from "react";
import { Link } from "react-router-dom";
import BrandNavBar from "./components/common/BrandNavBar";
import HeaderNavBar from "./components/common/HeaderNavBar";
import PropTypes from "prop-types";
import AreaChartType from "./visualizations/help/AreaChartType";
import BarChart from "./visualizations/help/BarChart";
import BubbleChart from "./visualizations/help/BubbleChart";
import DoughnutChart from "./visualizations/help/DoughnutChart";
import HorizontalBarChart from "./visualizations/help/HorizontalBarChart";
import LineChart from "./visualizations/help/LineChart";
import PieChart from "./visualizations/help/PieChart";
import PolarArea from "./visualizations/help/PolarArea";
import RadarChart from "./visualizations/help/RadarChart";
import ScatterChart from "./visualizations/help/ScatterChart";
import TableChart from "./visualizations/help/TableChart";
import MetricVisual from "./visualizations/help/MetricVisual";
import MixedData from "./visualizations/help/MixedData";
import SanKey from "./visualizations/help/SanKey";
import TreeMap from "./visualizations/help/TreeMap";
import ViolinChart from "./visualizations/help/ViolinChart";
import CalendarHeatMap from "./visualizations/help/CalendarHeatMap";
import MapVisual from "./visualizations/help/MapVisual";
import WaterFallChart from "./visualizations/help/WaterFallChart";
import CandleStick from "./visualizations/help/CandleStick";

/**
 * Help page component
 */

class HelpPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin">
        <div className="row">
          <BrandNavBar></BrandNavBar>
          <HeaderNavBar pathName={this.props} history={this.props.history} />
        </div>
        <div className="row pageTitle">
          <div className="p-4">
            <p className="largeNum displayDashboard tabText">
              <span>
                <hr className="topLineHelp" />
              </span>
              Help Page
            </p>
            <p className="tabText">Version 3.0</p>
            <p className="tabTextOne">Last Updated: 28/05/2020</p>
          </div>
        </div>
        <p
          className="moveRight tabText"
          style={{ marginTop: "-7em", marginRight: "6em" }}
        >
          User guide
        </p>
        <Link to="/files/User_guide_01.pdf" target="_blank" download>
          <img
            className="moveRight cursorStyleOne mr-5 downloadDashIcon"
            src="data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=="
            alt="download page"
            title="Download current dashboard"
            id="downloadDashIcon"
            style={{ marginTop: "-6em" }}
          />
        </Link>
        <div className="cardChart mt-5">
          <div className="tabText p-3">
            <p className="largeNum">Supported features:</p>
            <ol>
              <li>Dynamic support of multiple dashboards.</li>
              <li>Custom date range pickers and selectors.</li>
              <li>Theme supported: Light & Dark.</li>
              <li>
                Dynamic loading of metric as widgets along with the widget
                header i.e., Titles.
              </li>
              <li>Dynamic loading of chart data with their titles.</li>
              <li>
                Dynamic allocation of layouts for the charts in the
                visualization area.
              </li>
              <li>Dashboards search feature.</li>
              <li>Custom filters configurations for each dashboards.</li>
              <li>New date filter.</li>
              <li>Download visuals as PNG image.</li>
            </ol>
          </div>
        </div>
        <div className="cardChart mt-5">
          <div className="tabText p-3">
            <p className="largeNum">Supported chart types:</p>
            <p className="">
              Chart count: <b className="largeNum">20</b>
            </p>
            <div className="row p-4">
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <BarChart width={420} height={500} />
                  <h4 className="pt-5">Bar Chart</h4>
                  <p className="justifyContent">
                    A bar chart or bar graph is a chart or graph that presents
                    categorical data with rectangular bars with heights or
                    lengths proportional to the values that they represent. The
                    bars can be plotted vertically or horizontally. A vertical
                    bar chart is sometimes called a column chart.
                  </p>

                  <p className="justifyContent">
                    A bar graph shows comparisons among discrete categories. One
                    axis of the chart shows the specific categories being
                    compared, and the other axis represents a measured value.
                    Some bar graphs present bars clustered in groups of more
                    than one, showing the values of more than one measured
                    variable.
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <BubbleChart width={420} height={500} />
                  <h4 className="pt-5">Bubble Chart</h4>
                  <p className="justifyContent">
                    A bubble chart is a type of chart that displays three
                    dimensions of data. Each entity with its triplet (v1, v2,
                    v3) of associated data is plotted as a disk that expresses
                    two of the vi values through the disk's xy location and the
                    third through its size. Bubble charts can facilitate the
                    understanding of social, economical, medical, and other
                    scientific relationships.
                  </p>

                  <p className="justifyContent">
                    Bubble charts can be considered a variation of the scatter
                    plot, in which the data points are replaced with bubbles. As
                    the documentation for Microsoft Office explains, "You can
                    use a bubble chart instead of a scatter chart if your data
                    has three data series that each contain a set of values. The
                    sizes of the bubbles are determined by the values in the
                    third data series.".
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <DoughnutChart width={420} height={500} />
                  <h4 className="pt-5">Doughnut Chart</h4>
                  <p className="justifyContent">
                    A donut chart is essentially a Pie Chart with an area of the
                    centre cut out. Pie Charts are sometimes criticised for
                    focusing readers on the proportional areas of the slices to
                    one another and to the chart as a whole. This makes it
                    tricky to see the differences between slices, especially
                    when you try to compare multiple Pie Charts together.
                  </p>

                  <p className="justifyContent">
                    A Donut Chart somewhat remedies this problem by
                    de-emphasizing the use of the area. Instead, readers focus
                    more on reading the length of the arcs, rather than
                    comparing the proportions between slices. Also, Donut Charts
                    are more space-efficient than Pie Charts because the blank
                    space inside a Donut Chart can be used to display
                    information inside it.
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <HorizontalBarChart width={420} height={500} />
                  <h4 className="pt-5">Horizontal Bar Chart</h4>
                  <p className="justifyContent">
                    Horizontal bar graphs represent the data horizontally. It is
                    a graph whose bars are drawn horizontally. The data
                    categories are shown on the vertical axis and the data
                    values are shown on the horizontal axis. The length of each
                    bar is equal to the value corresponding the data category
                    and all bars go across from left to right.
                  </p>

                  <p className="justifyContent"></p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <LineChart width={420} height={500} />
                  <h4 className="pt-5">Line Chart</h4>
                  <p className="justifyContent">
                    A line chart or line plot or line graph or curve chart is a
                    type of chart which displays information as a series of data
                    points called 'markers' connected by straight line segments.
                    It is a basic type of chart common in many fields. It is
                    similar to a scatter plot except that the measurement points
                    are ordered (typically by their x-axis value) and joined
                    with straight line segments. A line chart is often used to
                    visualize a trend in data over intervals of time – a time
                    series – thus the line is often drawn chronologically. In
                    these cases they are known as run charts.
                  </p>

                  <p className="justifyContent"></p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <MetricVisual width={420} height={500} />
                  <h4 className="pt-5">Metric visualization</h4>
                  <p className="justifyContent">
                    A Metric Visualization or a Metric Collection is a
                    representation of Data where the numbers are represented as
                    a whole number or as a percentage or as a unit specific to
                    the dashboard that it is used in. There are cases where it
                    is just the numbers that matters for a dashboard user and it
                    matters especially when there is an important decision to be
                    taken based on that. Idea is to give the numbers handy and
                    then see the break down of the total number in different
                    visualization that follows.
                  </p>

                  <p className="justifyContent"></p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <MixedData width={420} height={500} />
                  <h4 className="pt-5">Mixed / Combo chart</h4>
                  <p className="justifyContent">
                    The Mixed / Combo chart is a visualization that combines the
                    features of the bar chart and the line chart. The Mixed /
                    Combo chart displays the data using a number of bars and/or
                    lines, each of which represent a particular category. A
                    combination of bars and lines in the same visualization can
                    be useful when comparing values in different categories,
                    since the combination gives a clear view of which category
                    is higher or lower.
                  </p>

                  <p className="justifyContent"></p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <PieChart width={420} height={500} />
                  <h4 className="pt-5">Pie Chart</h4>
                  <p className="justifyContent">
                    A pie chart (or a circle chart) is a circular statistical
                    graphic, which is divided into slices to illustrate
                    numerical proportion. In a pie chart, the arc length of each
                    slice (and consequently its central angle and area), is
                    proportional to the quantity it represents. While it is
                    named for its resemblance to a pie which has been sliced,
                    there are variations on the way it can be presented.
                  </p>

                  <p className="justifyContent">
                    Pie charts are very widely used in the business world and
                    the mass media. However, they have been criticized,[4] and
                    many experts recommend avoiding them, pointing out that
                    research has shown it is difficult to compare different
                    sections of a given pie chart, or to compare data across
                    different pie charts. Pie charts can be replaced in most
                    cases by other plots such as the bar chart, box plot, dot
                    plot, etc.
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <PolarArea width={420} height={500} />
                  <h4 className="pt-5">Polar area chart</h4>
                  <p className="justifyContent">
                    The polar area diagram is similar to a usual pie chart,
                    except sectors have equal angles and differ rather in how
                    far each sector extends from the center of the circle. The
                    polar area diagram is used to plot cyclic phenomena.
                  </p>

                  <p className="justifyContent"></p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <RadarChart width={420} height={500} />
                  <h4 className="pt-5">Radar chart</h4>
                  <p className="justifyContent">
                    A radar chart is a graphical method of displaying
                    multivariate data in the form of a two-dimensional chart of
                    three or more quantitative variables represented on axes
                    starting from the same point. The relative position and
                    angle of the axes is typically uninformative, but various
                    heuristics, such as algorithms that plot data as the maximal
                    total area, can be applied to sort the variables (axes) into
                    relative positions that reveal distinct correlations,
                    trade-offs, and a multitude of other comparative measures.
                  </p>

                  <p className="justifyContent"></p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <SanKey width={420} height={250} />
                  <h4 className="pt-5">Sankey chart</h4>
                  <p className="justifyContent">
                    Sankey diagrams are a type of flow diagram in which the
                    width of the arrows is proportional to the flow rate. Sankey
                    diagrams emphasize the major transfers or flows within a
                    system. They help locate the most important contributions to
                    a flow. They often show conserved quantities within defined
                    system boundaries.
                  </p>

                  <p className="justifyContent"></p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <ScatterChart width={420} height={500} />
                  <h4 className="pt-5">Scatter chart</h4>
                  <p className="justifyContent">
                    A scatter chart (also called a scatterplot, scatter graph,
                    scatter chart, scattergram, or scatter diagram) is a type of
                    plot or mathematical diagram using Cartesian coordinates to
                    display values for typically two variables for a set of
                    data. If the points are coded (color/shape/size), one
                    additional variable can be displayed. The data are displayed
                    as a collection of points, each having the value of one
                    variable determining the position on the horizontal axis and
                    the value of the other variable determining the position on
                    the vertical axis.
                  </p>

                  <p className="justifyContent"></p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <TableChart width={420} height={500} />
                  <h4 className="pt-5">Table</h4>
                  <p className="justifyContent">
                    A table chart is a means of arranging data in rows and
                    columns. The use of tables is pervasive throughout all
                    communication, research and data analysis. Tables appear in
                    print media, handwritten notes, computer software,
                    architectural ornamentation, traffic signs and many other
                    places. The precise conventions and terminology for
                    describing tables varies depending on the context.
                  </p>

                  <p className="justifyContent"></p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <TreeMap width={420} height={500} />
                  <h4 className="pt-5">Treemap</h4>
                  <p className="justifyContent">
                    Treemaps display hierarchical (tree-structured) data as a
                    set of nested rectangles. Each branch of the tree is given a
                    rectangle, which is then tiled with smaller rectangles
                    representing sub-branches. A leaf node's rectangle has an
                    area proportional to a specified dimension of the data.
                    Often the leaf nodes are colored to show a separate
                    dimension of the data.
                  </p>

                  <p className="justifyContent">
                    When the color and size dimensions are correlated in some
                    way with the tree structure, one can often easily see
                    patterns that would be difficult to spot in other ways, such
                    as if a certain color is particularly relevant. A second
                    advantage of treemaps is that, by construction, they make
                    efficient use of space. As a result, they can legibly
                    display thousands of items on the screen simultaneously.
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <WaterFallChart width={420} height={500} />
                  <h4 className="pt-5">Waterfall chart</h4>
                  <p className="justifyContent">
                    A waterfall chart is a form of data visualization that helps
                    in understanding the cumulative effect of sequentially
                    introduced positive or negative values. These intermediate
                    values can either be time based or category based. The
                    waterfall chart is also known as a flying bricks chart or
                    Mario chart due to the apparent suspension of columns
                    (bricks) in mid-air. Often in finance, it will be referred
                    to as a bridge.
                  </p>

                  <p className="justifyContent"></p>
                </div>
              </div>

              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <ViolinChart />
                  <h4 className="pt-5">Violin chart</h4>
                  <p className="justifyContent">
                    A violin plot is a method of plotting numeric data. It is
                    similar to a box plot, with the addition of a rotated kernel
                    density plot on each side. Violin plots are similar to box
                    plots, except that they also show the probability density of
                    the data at different values, usually smoothed by a kernel
                    density estimator. Typically a violin plot will include all
                    the data that is in a box plot: a marker for the median of
                    the data; a box or marker indicating the interquartile
                    range; and possibly all sample points, if the number of
                    samples is not too high.
                  </p>

                  <p className="justifyContent">
                    A violin plot is more informative than a plain box plot.
                    While a box plot only shows summary statistics such as
                    mean/median and interquartile ranges, the violin plot shows
                    the full distribution of the data. The difference is
                    particularly useful when the data distribution is multimodal
                    (more than one peak). In this case a violin plot shows the
                    presence of different peaks, their position and relative
                    amplitude.
                  </p>
                </div>
              </div>

              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <AreaChartType width={420} height={500} />
                  <h4 className="pt-5">Area chart</h4>
                  <p className="justifyContent">
                    A area chart or area graph displays graphically quantitative
                    data. It is based on the line chart. The area between axis
                    and line are commonly emphasized with colors, textures and
                    hatchings. Commonly one compares two or more quantities with
                    an area chart.
                  </p>

                  <p className="justifyContent"></p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <center>
                    <CalendarHeatMap width={420} height={500} />
                  </center>
                  <h4 className="pt-5">Calendar Heat Map</h4>
                  <p className="justifyContent">
                    A calendar heat map displays the number of activities takes
                    place in a day in calendar view. Days were arranged in a
                    column which depicts the weekly wise activities and they
                    were grouped together by months. It helps to quickly track
                    the activities which happend in a day, month and a year
                    wise.
                  </p>
                  <p className="justifyContent"></p>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <MapVisual width={420} height={250} />
                  <h4 className="pt-5">Map</h4>
                  <p className="justifyContent">
                    Map is a diagrammatic depiction which explains the
                    relationships between the regions over a larger area. It
                    helps to quickly track the activities and their progress in
                    the various parts of the region along with comparsion.
                  </p>
                  <p className="justifyContent"></p>
                </div>
              </div>

              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-4">
                <div className="chart-wrapper h-100 cardChart p-3">
                  <center>
                    <CandleStick width={420} height={250} />
                  </center>
                  <h4 className="pt-5">Candle Stick</h4>
                  <p className="justifyContent">
                    A candle stick chart is similar to bar chart which shows
                    important informations about the activities such as low,
                    high, open and close actions occured in a specific period or
                    in a single day.
                  </p>
                  <p className="justifyContent"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HelpPage;
