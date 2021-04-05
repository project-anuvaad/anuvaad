import { createMuiTheme } from '@material-ui/core/styles';


const themeDefault = createMuiTheme({

  typography: {
    fontFamily: '"Source Sans Pro", "Arial", sans-serif',
    fontSize: '5rem'
  },
  palette: {
    primary: {
      light: '#1c9ab7',
      main: '#1c9ab7',
      dark: '#1c9ab7',
      contrastText: '#FFFFFF'
    },
    secondary: {
      light: '#000000',
      main: '#000000',
      dark: '#000000',
      contrastText: '#FFFFFF'
    },
    background: {
      // default: '#C0C0C0'
    }
  },
  status: {
    danger: 'orange'
  },
  drawer: {
    default: '#696969'
  }

});


export default themeDefault;
