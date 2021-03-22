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

var randomColor = require('randomcolor');
var jp                = require('jsonpath')
const data = [
    {
        "updatedTimestamp" : "2021-02-25T00:00:00.000Z",
        "version" : "2021-v1",
        "src_name" : "PIB",
        "domain" : "General",
        "languagePair" : "en-hi",
        "site" : "pib.gov.in",
        "count" : 401859,
        "pair-type" : "Machine Readable"
      },
      {
        "updatedTimestamp" : "2021-02-25T00:00:00.000Z",
        "version" : "2021-v1",
        "src_name" : "PIB",
        "domain" : "General",
        "languagePair" : "en-bn",
        "site" : "pib.gov.in",
        "count" : 74433,
        "pair-type" : "Machine Readable"
      },
      {
        "updatedTimestamp" : "2021-02-25T00:00:00.000Z",
        "version" : "2021-v1",
        "src_name" : "PIB",
        "domain" : "General",
        "languagePair" : "en-ta",
        "site" : "pib.gov.in",
        "count" : 104836,
        "pair-type" : "Machine Readable"
      },
      {
        "updatedTimestamp" : "2021-02-25T00:00:00.000Z",
        "version" : "2021-v1",
        "src_name" : "PIB",
        "domain" : "General",
        "languagePair" : "en-te",
        "site" : "pib.gov.in",
        "count" : 65842,
        "pair-type" : "Machine Readable"
      },
      {
        "updatedTimestamp" : "2021-02-25T00:00:00.000Z",
        "version" : "2021-v1",
        "src_name" : "PIB",
        "domain" : "General",
        "languagePair" : "en-ml",
        "site" : "pib.gov.in",
        "count" : 27538,
        "pair-type" : "Machine Readable"
      }
    
  ];
class ChartRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            word: "",
        }

    }

    getData(dataValue){
        let condition   = `$..[*].${dataValue}`
    let dataCalue      = jp.query(data, condition)
    return dataCalue
    }
    
    getOption(){
   
        const option = {
            tooltip: {},
            xAxis: {
                type: 'category',
                data: this.getData("languagePair"),
              },
              yAxis: {
                type: 'value',
              },
              series: [
                {
                  data:this.getData("count"),
                  type: 'bar',
                  smooth: true,
                },
              ],
              
        }
    
         return option
      }

    handleOnClick(event) {
        // this.setState({secondRender:true})
        history.push(
            `${process.env.PUBLIC_URL}/parallel-corpus/${event.languagePair}`,
            this.state
          );
        
    }

    render() {
        const { classes, open_sidebar } = this.props;
        this.getData()
        return (

            <div>
                <ReactECharts
  option={this.getOption()}
  notMerge={true}
  lazyUpdate={true}
  theme={"theme_name"}
  onChartReady={this.onChartReadyCallback}
  onChartClick = {
    console.log("sajish")
}
  
  
/>
<BarChart width={800} height={400} data={data} maxBarSize={100} barSize={80} style={{marginLeft:'20%',marginTop:"10%"}}>
              <XAxis dataKey="languagePair"/>
              <YAxis type="number" />
              <CartesianGrid horizontal={true} vertical={false}/>
              <Tooltip />
              <Bar dataKey="count" fill="green" maxBarSize={100} isAnimationActive={false} onClick={(event)=>{this.handleOnClick(event)}}>
       		{
          	data.map((entry, index) => {
            	const color = Math.floor(Math.random()*16777215).toString(16);
                console.log(color)
            	return <Cell fill={`#${color}`} />;
            })
          }
       </Bar>
              {/* <Bar dataKey="count" fill={randomColor()} maxBarSize={100} isAnimationActive={false} onClick={(event)=>{this.handleOnClick(event)}}/> */}
            </BarChart>
           
           
            {/* {this.state.secondRender && <DrillChartRender />}
            <DrillSourceRender/> */}
            </div>
         
        )
    }
}

const mapStateToProps = state => ({
    open_sidebar: state.open_sidebar.open
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        APITransport,
        showSidebar
    },
    dispatch
);


export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(GlobalStyles(Theme), { withTheme: true })(ChartRender)));
