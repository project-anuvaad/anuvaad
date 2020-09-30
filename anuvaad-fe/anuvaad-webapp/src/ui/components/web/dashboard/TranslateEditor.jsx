import React from "react";
import Paper from "@material-ui/core/Paper";

import { ResponsiveContainer } from "recharts";

import Typography from '@material-ui/core/Typography';
const TranslateSentence = props => {
  const { title, data} = props;
  const styles = {
    paper: {
      backgroundColor: '#9E9E9E',
      // height: 150
    },
    div: {
      // height: 95,
      padding: "5px 15px 15px 15px",
      color: '#000000',

    },
    header: {
      fontSize: 24,
      fontWeight: typography.fontWeightLight,
      color: '#000000',
      backgroundColor: '#9E9E9E',
      padding: 10,
      marginLeft:"55px"
    }
  };

  return (
    <Paper style={styles.paper}>
      <div style={{ ...styles.header}}>Please add your sentence</div>
      <div style={styles.div}>
        <ResponsiveContainer>
        <div>
            <textarea style={{width:'86%', marginLeft:'30px',fontFamily: '"Source Sans Pro", "Arial", sans-serif',fontSize:'21px'}}
              className="noter-text-area"
              rows="5"
              cols="50"
              
             
            />
            </div>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

// NewOrders.propTypes = {
//   data: PropTypes.array
// };

export default TranslateSentence;