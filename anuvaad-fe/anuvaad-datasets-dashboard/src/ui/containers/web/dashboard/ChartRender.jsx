import React from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import GlobalStyles from "../../../styles/web/styles";
import Theme from "../../../theme/web/theme-red";

import classNames from "classnames";
import history from "../../../../web.history";
import {
  BarChart, Bar, Brush, Cell, CartesianGrid, ReferenceLine, ReferenceArea,
  XAxis, YAxis, Tooltip, Legend, ErrorBar, LabelList, Rectangle
} from 'recharts';
import ReactECharts from 'echarts-for-react';
import _ from 'lodash';

import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { showSidebar } from '../../../../flux/actions/apis/common/showSidebar';

import { currentPageUpdate } from "../../../../flux/actions/apis/drillDown"

var randomColor = require('randomcolor');
var jp = require('jsonpath')
const data = [{ value: 2400614, label: 'Hindi' }, { value: 1290410, label: 'Bengali' }, { value: 1190325, label: 'Tamil' }, { value: 1283020, label: 'Malayalam' }, { value: 1362367, label: 'Telugu' }, { value: 1085055, label: 'Kannada' }, { value: 1456320, label: 'Marathi' },]
const source = [{ value: 81884, label: 'HC/SUVAS' }, { value: 3000, label: 'Legal Terminologies' }, { value: 263100, label: 'PIB' }, { value: 264200, label: 'NewsOnAir' }, { value: 81884, label: 'DD News Sports' }, { value: 307430, label: 'OneIndia' }, { value: 263100, label: 'Times of India' }]
const domain = [{ value: 1442876, label: 'Judicial' }, { value: 569327, label: 'News' }, { value: 754631, label: 'General' }, { value: 632419, label: 'Tourism' }, { value: 654631, label: 'sports' }, { value: 652419, label: 'Financial' }]
class ChartRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      word: "",
      currentPage: 0,
      dataSet: data
    }

  }

  componentDidMount() {
    this.props.currentPageUpdate({ currentPage: 0, dataSet: data, title: "Language Datasets Chart" })
  }

  getData(dataValue) {
    let condition = `$..[*].${dataValue}`
    let dataCalue = jp.query(data, condition)
    return dataCalue
  }

  getOption() {

    const option = {
      tooltip: {},
      xAxis: {
        type: 'category',
        data: this.getData("label"),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: this.getData("value"),
          type: 'bar',
          smooth: true,
        },
      ],

    }

    return option
  }



  handleOnClick(event) {
    switch (this.state.currentPage) {
      case 0:
        this.setState({ currentPage: 1, dataSet: domain, title: "Domain Details Chart" })
        this.props.currentPageUpdate({ currentPage: 1, dataSet: domain, title: "Domain Details Chart" })

        break;
      case 1:
        this.setState({ currentPage: 2, dataSet: source, title: "Source Details Chart" })
        this.props.currentPageUpdate({ currentPage: 2, dataSet: source, title: "Source Details Chart" })

        break;
      default:
        this.setState({ currentPage: 0, dataSet: data, title: "Language Datasets Chart" })
    }
    console.log(event.target)
    if (this.state.currentPage < 3) {
      this.setState({ currentPage: this.state.currentPage + 1 })
    }
    console.log(this.state.currentPage)

  }

  onChartClick = (params) => {
    console.log("sajish", params)
  }



  render() {
    const { classes, open_sidebar } = this.props;
    const onEvents = {
      'click': this.onChartClick,
      'legendselectchanged': this.onChartLegendselectchanged
    }
    this.getData()
    return (

      <div>
        {/* <ReactECharts
  option={this.getOption()}
  notMerge={true}
  lazyUpdate={true}
  theme={"theme_name"}
  onEvents= {onEvents}
  onChartReady={this.onChartReadyCallback}
  onChartClick = {(params)=>{
    console.log("sajish")
    // Do what you want to do on click event. params depend on the  type of  chart 
}}
  
  
  
/> */}
        <BarChart width={800} height={400} data={this.state.dataSet} maxBarSize={100} barSize={80} style={{ marginLeft: '20%', marginTop: "10%" }}>
          <XAxis dataKey="label" />
          <YAxis type="number" />
          <CartesianGrid horizontal={true} vertical={false} />

          <Tooltip />
          <Bar dataKey="value" fill="green" maxBarSize={100} onClick={(event) => { this.handleOnClick(event) }}>

            <LabelList dataKey="value" position="top" />
            {
              data.map((entry, index) => {
                const color = Math.floor(Math.random() * 16777215).toString(16);
                return <Cell fill={`#${color}`} />;
              })
            }
          </Bar>
        </BarChart>
      </div>

    )
  }
}

const mapStateToProps = state => ({
  // open_sidebar: state.open_sidebar.open
  drill_down: state.drill_down
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    APITransport,
    showSidebar,
    currentPageUpdate
  },
  dispatch
);


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(GlobalStyles(Theme), { withTheme: true })(ChartRender)));
