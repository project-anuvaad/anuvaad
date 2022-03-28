import { createMuiTheme } from '@material-ui/core/styles';


const themeAnuvaad = createMuiTheme({

  typography: {
    h4:{
      fontWeight: '549',
      fontfamily: '"Source Sans Pro", sans-serif',
      color: '#003366',
      textAlign:'center'

    },
    fontFamily: '"Source Sans Pro","Regular","Arial", sans-serif',
    fontSize: 14,
    color: "#000000",
  },
  palette: {
    primary: {
      light: 'rgb(28, 154, 183)',
      main: 'rgb(28, 154, 183)',
      dark: 'rgb(7, 80, 97)',
      contrastText: '#FFFFFF',
      color: 'inherit',

    },
    secondary: {
      light: '#FFFFFF',
      main: '#FFFFFF',
      dark: '#FFFFFF',
      contrastText: '#233466'
    },
    background: {
      default: '#F5F9FA',
      color:"inherit"
    }
  },
  status: {
    danger: 'orange'
  },

  drawer: {

    default: '#1976d2',
    color:'inherit'
  },

  Link:
  {
    fontFamily: '"Source Sans Pro", "Arial", sans-serif',
    fontSize: 16,
    color: "#1C9AB7"
  },
  overrides: {
    MuiButton: {
      label: {
        textTransform: 'capitalize',
      },
    },
  },

});


export default themeAnuvaad;
