import React from "react";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = {
  root: {
    flexGrow: 1
  }
};

class LinearDeterminate extends React.Component {
  state = {
    completed: 0,
    
  };

  componentDidMount() {
    if (this.state.completed !== 100) {
      const interval = this.props.eta/100
      
      this.setState({completed:(this.props.eta - this.props.val )/interval})
      this.timer = setInterval(this.progress, interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  progress = () => {
    const { completed } = this.state;
    if (completed === 100) {
      clearInterval(this.timer);
        this.props.handleRefresh();
    } else {
      
      this.setState({ completed: completed + 1 });
      this.props.handleRefresh();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.props.token===true ?
        <LinearProgress/>
        :
        <LinearProgress  variant= "determinate" value={this.state.completed} />
        
  }
        
        <br />
      </div>
    );
  }
}



export default withStyles(styles)(LinearDeterminate);
