import React from "react";
import Paper from "@material-ui/core/Paper";
import { blueGrey50, darkBlack } from "material-ui/styles/colors";
import { ResponsiveContainer } from "recharts";
import { typography } from "material-ui/styles";
import Typography from '@material-ui/core/Typography';
const TranslateSentence = props => {
  const { title, data } = props;
  const styles = {
    paper: {
      backgroundColor: blueGrey50,
      // height: 150
    },
    div: {
      // height: 95,
      padding: "5px 15px 15px 15px",
      color: darkBlack,
      textAlign: "left"

    },
    header: {
      fontSize: 24,
      fontWeight: typography.fontWeightLight,
      color: darkBlack,
      backgroundColor: blueGrey50,
      padding: 10,
      marginLeft: "12px",
      textAlign: 'left'
    }
  };

  return (
    <Paper style={styles.paper}>
      <div style={{ ...styles.header }}>{title}</div>
      <div style={styles.div}>
        <ResponsiveContainer>
          <div>
            <Typography variant="subtitle1" gutterBottom style={{ color: darkBlack, marginLeft: "30px", textAlign: "left" }} >{data ? data : ''}</Typography>
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
