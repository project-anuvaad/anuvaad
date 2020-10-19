
const drawerWidth = 240;
const PdfStyles = theme => ({

root: {
    display: "flex"
  },
  
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  appBar:{
    marginTop:'70px',
    height:'70px',
    minWidth:'1300px',
    padding:'.2%'
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  buttonLeft:{
                
    marginLeft:'148px',
    marginTop: "17%",
    height:'12%',
    position: "fixed",
    backgroundColor:'#335995'
    
  },
  buttonRight:{
        marginLeft:'110px',
        marginTop: "17%",
        position: "fixed",
        height:'12%',
        backgroundColor:'#335995'
  },
  editButton:{
    width:"70%"
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: '140px',
    flexShrink: 0
  },
  drawerPaper: {
    marginTop:'140px',
    width: '282px',
    backgroundColor:'#335995'
    
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3) ,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
});


export default PdfStyles;