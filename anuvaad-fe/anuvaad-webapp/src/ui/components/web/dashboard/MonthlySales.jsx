import React from "react";
import Paper from "@material-ui/core/Paper";
import { white, grey900, grey500 } from "material-ui/styles/colors";
import { BarChart, Bar, ResponsiveContainer, XAxis } from "recharts";
import GlobalStyles from "../../../styles/web/styles";
import { translate } from '../../../../assets/localisation';

const MonthlySales = props => {
  const { data } = props;
  const styles = {
    paper: {
      backgroundColor: grey900,
      height: 150
    },
    div: {
      marginLeft: "auto",
      marginRight: "auto",
      width: "95%",
      height: 85
    },
    header: {
      color: white,
      backgroundColor: grey900,
      padding: 10
    }
  };

  return (
    <Paper style={styles.paper}>
      <div style={{ ...GlobalStyles.title, ...styles.header }}>{translate('monthlySales.page.label.monthlysales')}</div>
      <div style={styles.div}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <Bar dataKey="uv" fill={grey500} />
            <XAxis dataKey="name" stroke="none" tick={{ fill: white }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

// MonthlySales.propTypes = {
//   data: PropTypes.array
// };

export default MonthlySales;
