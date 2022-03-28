import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
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

import _ from 'lodash';

import APITransport from "../../../../flux/actions/apitransport/apitransport";



const data = [
    {
        "updatedTimestamp" : "2021-02-25T00:00:00.000Z",
        "version" : "2021-v1",
        "src_name" : "PIB",
        "domain" : "General",
        "language-pair" : "en-hi",
        "site" : "pib.gov.in",
        "count" : 4098,
        "pairType" : "Machine Translated"
      },
      {
        "updatedTimestamp" : "2021-02-25T00:00:00.000Z",
        "version" : "2021-v1",
        "src_name" : "Wiki",
        "domain" : "General",
        "language-pair" : "en-bn",
        "site" : "pib.gov.in",
        "count" : 5743,
        "pairType" : "Machine Readable"
      },
      {
        "updatedTimestamp" : "2021-02-25T00:00:00.000Z",
        "version" : "2021-v1",
        "src_name" : "Indian exp",
        "domain" : "General",
        "language-pair" : "en-ta",
        "site" : "pib.gov.in",
        "count" : 1836,
        "pairType" : "Indic Corp"
      },
      {
        "updatedTimestamp" : "2021-02-25T00:00:00.000Z",
        "version" : "2021-v1",
        "src_name" : "Anuvaad",
        "domain" : "General",
        "languagePair" : "en-te",
        "site" : "pib.gov.in",
        "count" : 1652,
        "pairType" : "Machine"
      },
      {
        "updatedTimestamp" : "2021-02-25T00:00:00.000Z",
        "version" : "2021-v1",
        "src_name" : "test",
        "domain" : "General",
        "languagePair" : "en-ml",
        "site" : "pib.gov.in",
        "count" : 2748,
        "pairType" : "sample"
      }
    
  ];
class SourceRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }

    }

    handleOnClick(event) {
        history.push(`${process.env.PUBLIC_URL}/parallel-corpus/${event.pairType}`);
    }

    render() {
        const { classes, open_sidebar } = this.props;
        return (

            
            <BarChart width={800} height={400} data={data} maxBarSize={100} barSize={80} style={{marginLeft:'20%',marginTop:"10%"}}>
              <XAxis dataKey="src_name"/>
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
            </BarChart>
         
        )
    }
}

const mapStateToProps = state => ({
    // open_sidebar: state.open_sidebar.open
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        APITransport
    },
    dispatch
);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(GlobalStyles(Theme), { withTheme: true })(SourceRender)));