import React from 'react';

import Countdown from 'react-countdown-now';
 
class Timer extends React.Component {

    state = {
        completed: 0,
        
      };
    
 
// Renderer callback with condition
renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    this.props.handleRefresh();
   return "Completed";
  } else {
    // Render a countdown
    return <span>{hours > 9 ? hours : "0" +hours }:{minutes > 9 ? minutes : "0" +minutes}:{seconds > 9 ? seconds : "0" +seconds}</span>;
  }
};
 
render() {

    return (
  <Countdown
    date={ Date.now()+this.props.val}
    renderer={this.renderer}
  />
);
}
}




export default (Timer);