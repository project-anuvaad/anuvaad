import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Appbar from "../../components/web/common/Appbar";
import EditPdfTranslator from "../../styles/web/EditPdfStyles";

class PersistentDrawerLeft extends React.Component {
  state = {
    open: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <div>
        <Grid container spacing={24} style={{ padding: 24 }}>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <div style={{ marginLeft: "-5%", marginTop: "-1%" }}>
              <Appbar />
            </div>
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <div className={classes.root}>
              <Drawer
                color="inherit"
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                  paper: classes.drawerPaper
                }}
              >
                <List>
                  {["Components"].map((text, index) => (
                    <ListItem button>
                      <ListItemText
                        primary={
                          <Typography type="body2" style={{ color: "#FFFFFF" }}>
                            {text}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <List>
                  {["1.Header Image (NA)", "2.Header Text", "3.Title", "4.List Items", "5.Paragraph"].map((text, index) => (
                    <ListItem button key={text}>
                      <ListItemText
                        primary={
                          <Typography type="body2" style={{ color: "#FFFFFF" }}>
                            {text}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Drawer>
              <main
                className={classNames(classes.content, {
                  [classes.contentShift]: open
                })}
              >
                {this.state.open ? (
                  <Button color="primary" variant="contained" className={classes.buttonLeft} onClick={this.handleDrawerClose}>
                    <ChevronLeftIcon />
                  </Button>
                ) : (
                  <Button color="primary" variant="contained" className={classes.buttonRight} onClick={this.handleDrawerOpen}>
                    <ChevronRightIcon />
                  </Button>
                )}
                <div className={classes.drawerHeader} />
              </main>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(EditPdfTranslator)(PersistentDrawerLeft);
