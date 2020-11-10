import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import Grid from "@material-ui/core/Grid";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import history from "../../../../web.history";

import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import logo from '../../../../assets/logo.png';
import anuvaadLogo from '../../../../assets/AnuvaadLogo.svg';
import { translate } from '../../../../../src/assets/localisation';
import DownIcon from '@material-ui/icons/ArrowDropDown';
import PeopleIcon from '@material-ui/icons/Person';
import themeAnuvaad from "../../../theme/web/theme-anuvaad";
import Fab from '@material-ui/core/Fab';

const styles = {
  container: {},
  containerDemo: {},
  appBar: {},
  appBarShift: {},
  buttonLeft: {},
  buttonRight: {},
  editButton: {},
  hide: {},
  drawer: {},
  drawerPaper: {},
  drawerHeader: {},
  contentShift: {},
  drawerPaperClose: {},
  toolbar: {},
  title: {},
  content: {},

  root: {
    flexGrow: 1,

  },
  flex: {
    flex: 1,

  },
  felxDemo: {
    flex: 1,
    marginLeft: "1%"
  },
  menuButton: {
    marginLeft: -12,
    // marginRight: 20,
    marginRight: "8px !important",
  },
  divider: {
    marginLeft: '12%',
    marginRight: '12%'
  }
};

class Header extends React.Component {
  state = {
    open: false,
    auth: true,
    anchorEl: null,
    heading: translate('header.page.heading.translation'),
    name: localStorage.getItem("userDetails"),
    userName: "",
    currentPage: 'dashboard'
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  componentDidUpdate() {
    if (this.state.open && this.props.tocken) {
      this.setState({ open: false });

    }
    if (this.props.tocken) {
      this.props.handleTockenChange()
    }
  }

  handleDrawerTranslate = () => {
    this.setState({
      open: false,
      heading: translate('header.page.heading.translation')
    });
  };

  handleDrawerDoc = () => {
    this.setState({
      open: false,
      heading: translate('common.page.title.document')
    });
  };
  handleDrawerClose() {
    this.setState({
      open: false
    });
  };

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget, currentPage: "" });
  };

  handleMenuOpenClose = event => {
    this.setState({ open: !this.state.open });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, title, drawer, forDemo, dontShowHeader, currentMenu } = this.props;

    const { auth, anchorEl, open } = this.state;
    const openEl = Boolean(anchorEl);
    var role = JSON.parse(localStorage.getItem("roles"));
    var useRole = [];
    role.map((item, value) => {
      useRole.push(item); value !== role.length - 1 && useRole.push(", ")
      return true;
    });
    const ToolbarComp = this.props.toolBarComp; // eslint-disable-line

    return (
      <div>
        <AppBar position="fixed" color="secondary" className={classNames(classes.appBar, open && classes.appBarShift)} style={{ height: '50px' }}>

          <Toolbar disableGutters={!open} style={{ minHeight: "50px" }}>

            {this.state.open ?
              <IconButton onClick={this.handleMenuOpenClose} className={classes.menuButton} color="inherit" aria-label="Menu">
                <CloseIcon />
              </IconButton> :
              <div style={{ display: "flex", flexDirection: "row" }}>{
                currentMenu === "texttranslate" &&
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <IconButton onClick={() => {
                    history.push(`${process.env.PUBLIC_URL}/view-document`);
                  }} className={classes.menuButton} color="inherit" aria-label="Menu">
                    <BackIcon />
                  </IconButton>
                  <div style={{ borderLeft: "1px solid #D6D6D6", height: "40px", marginRight: "1px", marginTop: "5px" }}></div>
                </div>
              }
                <IconButton onClick={this.handleMenuOpenClose} className={classes.menuButton} color="inherit" aria-label="Menu">
                  <MenuIcon />
                </IconButton>
              </div>
            }
            <div style={{ borderLeft: "1px solid #D6D6D6", height: "40px", marginRight: "10px" }}></div>
            {forDemo &&
              <img src={logo}
                alt=""
                style={{
                  width: '2%',
                  display: 'block',
                  marginLeft: '1%'
                }} />
            }

            <Typography variant="h5" color="inherit" className={forDemo ? classes.felxDemo : classes.flex}>
              {title}
            </Typography>
            {this.props.toolBarComp &&
              <div style={{position: 'absolute', right: '20px'}}>
                <ToolbarComp />
              </div>
            }
          </Toolbar>
        </AppBar>
        <div>
          {!drawer &&
            <Grid container spacing={10}>

              <Drawer
                color="inherit"
                variant="persistent"
                anchor="left"
                open={open}

                onClick={() => {
                  this.handleDrawerClose();
                }}

                classes={{
                  paper: classes.drawerPaper
                }}
              >
                <List>
                  <ListItem>
                    <ListItemText
                      disableTypography
                      style={{ textAlign: "left", marginLeft: "6%" }}
                      primary={
                        <img src={anuvaadLogo}
                          width={100}
                          alt="" />
                      }
                    />
                  </ListItem>

                  {role && Array.isArray(role) && !role.includes("analyzer") && !role.includes("admin") && !role.includes("user") && (
                    <div>
                      <Divider className={classes.divider} />

                      <ListItem
                        style={{ paddingTop: "8%", paddingBottom: "8%", backgroundColor: currentMenu === "dashboard" && themeAnuvaad.palette.primary.main }}
                        button
                        onClick={() => {
                          this.handleDrawerClose();
                          history.push(`${process.env.PUBLIC_URL}/instant-translate`);
                        }}
                      >

                        <ListItemText
                          disableTypography
                          primary={
                            <Typography type="body2" style={{ color: currentMenu === "dashboard" ? "#FFFFFF" : "#000000", marginLeft: '6%' }}>
                              {translate('dashboard.page.heading.title')}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </div>
                  )}

                  {role && Array.isArray(role) && (role.includes("dev") || role.includes("grader") || role.includes("interactive-editor")) && (
                    <div>
                      <Divider className={classes.divider} />
                      <ListItem
                        style={{ paddingTop: "8%", paddingBottom: "8%", backgroundColor: currentMenu === "view-document" && themeAnuvaad.palette.primary.main }}
                        button
                        onClick={() => {
                          this.handleDrawerClose();
                          history.push(`${process.env.PUBLIC_URL}/view-document`);
                        }}
                      >

                        <ListItemText
                          disableTypography
                          primary={
                            <Typography type="body2" style={{ color: currentMenu === "view-document" ? "#FFFFFF" : "#000000", marginLeft: '6%' }}>
                              Translate document
                            </Typography>
                          }
                        />
                      </ListItem>
                    </div>
                  )}

                  <div>
                    <Divider className={classes.divider} />

                    <ListItem
                      style={{ paddingTop: "8%", paddingBottom: "8%", backgroundColor: currentMenu === "profile" && themeAnuvaad.palette.primary.main }}
                      button
                      onClick={() => {
                        this.handleDrawerClose();
                        history.push(`${process.env.PUBLIC_URL}/profile`);
                      }}
                    >

                      <ListItemText
                        disableTypography
                        primary={
                          <Typography type="body2" style={{ color: currentMenu === "profile" ? "#FFFFFF" : "#000000", marginLeft: '6%' }}>
                            {translate('header.page.heading.MyProfile')}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </div>

                  <div>
                    <Divider className={classes.divider} />

                    <ListItem
                      style={{ paddingTop: "8%", paddingBottom: "8%", backgroundColor: currentMenu === "logout" && themeAnuvaad.palette.primary.main }}
                      button
                      onClick={() => {
                        this.handleDrawerClose();
                        history.push(`${process.env.PUBLIC_URL}/logout`);
                      }}
                    >

                      <ListItemText
                        disableTypography
                        primary={
                          <Typography type="body2" style={{ color: currentMenu === "logout" ? "#FFFFFF" : "#000000", marginLeft: '6%' }}>
                            {translate('header.page.heading.logout')}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </div>
                </List>
              </Drawer>

            </Grid>
          }
        </div>
      </div >
    );
  }
}


export default withStyles(styles)(Header);
