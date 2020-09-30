import React from "react";
import Paper from "@material-ui/core/Paper";


import Typography from '@material-ui/core/Typography';
const TranslateSentence = props => {
  const { title, data } = props;
  const styles = {
    paper: {
      backgroundColor: '#9E9E9E',
      // height: 150
    },
    div: {
      // height: 95,
      padding: "5px 15px 15px 15px",
      color: '#000000',
      textAlign: "left"

    },
    header: {
      fontSize: 24,
      // fontWeight: typography.fontWeightLight,
      color: '#000000',
      backgroundColor: '#9E9E9E',
      padding: 10,
      marginLeft: "12px",
      textAlign: 'left'
    }
  };

  return (
    <Paper style={styles.paper}>
      <div style={{ ...styles.header }}>{title}</div>
      <div style={styles.div}>
     
          <div>
            <Typography variant="subtitle1" gutterBottom style={{ color: '#000000', marginLeft: "30px", textAlign: "left" }} >{data ? data : ''}</Typography>
          </div>
       
      </div>
    </Paper>
  );
};

// NewOrders.propTypes = {
//   data: PropTypes.array
// };

export default TranslateSentence;
