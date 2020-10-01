import React, { Component } from 'react'
import AppBarButton from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { translate } from '../../../../../src/assets/localisation';
class AppBar extends Component {


  render() {
    //var {base}=this.props
    return (
      <AppBarButton position="static" >
        <Toolbar>
          
          <Typography variant="h6" color="inherit" style={{ marginLeft: "5%", flex: 1 }}>
            {translate('appbar.page.label.totalSentence')} {this.props.count}
          </Typography>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {this.props.pending === 0 ? "Completed" : ("Number of sentence pending :" + this.props.pending)}
          </Typography>

          {this.props.pending !== 0 && <Typography variant="h6" color="inherit" >{translate('appbar.page.label.pending')} {this.props.val}</Typography>}



        </Toolbar>
      </AppBarButton>

    )
  }
}



export default AppBar;