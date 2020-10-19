import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
const TranslateSentence = props => {
  const { title, data} = props;
  const styles = {
    paper: {
      backgroundColor: '#ECEFF1',
      // height: 150
    },
    div: {
      // height: 95,
      padding: "5px 15px 15px 15px",
      color: '#000000',

    },
    header: {
      fontSize: 24,
      color: '#000000',
      backgroundColor: '#ECEFF1',
      padding: 10,
      marginLeft:"55px"
    }
  };

  return (
    <Paper style={styles.paper}>
      <div style={{ ...styles.header}}>Please add your sentence</div>
      <div style={styles.div}>
        <div>
            <textarea style={{width:'86%', marginLeft:'30px',fontFamily: '"Source Sans Pro", "Arial", sans-serif',fontSize:'21px'}}
              className="noter-text-area"
              rows="5"
              cols="50"
              
             
            />
            </div>
      </div>
    </Paper>
  );
};

// NewOrders.propTypes = {
//   data: PropTypes.array
// };

export default TranslateSentence;