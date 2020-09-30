import React from 'react';
import Paper from '@material-ui/core/Paper';
import { white, grey900 } from 'material-ui/styles/colors';
import { typography } from 'material-ui/styles';

class InfoBox extends React.Component {
  render() {
    const { color, title, value, Icon } = this.props;

    const styles = {
      content: {
        padding: '5px 10px',
        marginLeft: 90,
        height: 80,
        backgroundColor: grey900
      },
      number: {
        display: 'block',
        fontWeight: typography.fontWeightMedium,
        fontSize: 18,
        color: white
      },
      text: {
        fontWeight: typography.fontWeightLight,
        color: white
      },
      iconSpan: {
        float: 'left',
        height: 90,
        width: 90,
        textAlign: 'center',
        backgroundColor: color
      },
      icon: {
        height: 48,
        width: 48,
        marginTop: 20,
        maxWidth: '100%',
        color: 'white'
      }
    };

    return (
      <Paper>
        <span style={styles.iconSpan}>
          <Icon
            color={white}
            style={styles.icon}
          />
        </span>

        <div style={styles.content}>
          <span style={styles.text}>{title}</span>
          <span style={styles.number}>{value}</span>
        </div>
      </Paper>
      );
  }
}

// InfoBox.propTypes = {
//   Icon: PropTypes.any, // eslint-disable-line
//   color: PropTypes.string,
//   title: PropTypes.string,
//   value: PropTypes.any
// };

export default InfoBox;
