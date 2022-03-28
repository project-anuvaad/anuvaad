
const drawerWidth = 240;

const GlobalStyles = theme => ({
  container: {
    margin: '5em 0em 1em 5em',
    width: '100%',
    background: theme.palette.background.default,
    fontFamily: theme.typography.fontFamily,
    minHeight: '-webkit-fill-available'
  },
  root: {
    background: theme.palette.background.default,
    flexGrow: 1,
    // height: 430,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  appBar: {
    // backgroundColor: theme.palette.primary.dark,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {

    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36

  },
  hide: {
    display: 'none'
  },
  drawerPaper: {
    backgroundColor: theme.drawer.default,
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9
    }
  },
  toolbar: {
    // backgroundColor: '#171616',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  title: {
    color: 'white'
  },

  content: {
    background: theme.palette.background.default,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    marginTop: '3%'
  }
});


export default GlobalStyles;
