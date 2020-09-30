import React from "react";
import Paper from "@material-ui/core/Paper";
import { blueGrey50,darkBlack } from "material-ui/styles/colors";
import { ResponsiveContainer } from "recharts";
import { typography } from "material-ui/styles";
import Typography from '@material-ui/core/Typography';
const TranslateSentence = props => {
  const { title, data} = props;
  const styles = {
    paper: {
      backgroundColor: blueGrey50,
      // height: 150
    },
    div: {
      // height: 95,
      padding: "5px 15px 15px 15px",
      color: darkBlack,

    },
    header: {
      fontSize: 24,
      fontWeight: typography.fontWeightLight,
      color: darkBlack,
      backgroundColor: blueGrey50,
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