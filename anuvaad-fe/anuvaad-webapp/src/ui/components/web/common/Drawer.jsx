import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";


class AppDrawer extends React.Component {
  render(){
    const {  variant, color, open, classes, anchor,componentList,listValues} = this.props;
return(
  <Drawer
          color={color}
          variant="permanent"
          anchor={anchor}
          open={open}
          styles={classes}
        >
          <List>
            {componentList.map((text, index) => (
              <ListItem button >
                <ListItemText primary={<Typography type="body2" style={{ color: '#FFFFFF' }}>{text}</Typography>} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List >
            {listValues.map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={<Typography type="body2" style={{ color: '#FFFFFF' }}>{text}</Typography>}/>
              </ListItem>
            ))}
          </List>
        </Drawer>
)
  }
  
};
export default AppDrawer;