import { createMuiTheme } from '@material-ui/core/styles';


const themeRed = createMuiTheme({
  typography: {
    fontFamily: '"Gill Sans", sans-serif',
    fontSize: '5rem'
  },
  palette: {
    primary: {
      light: '#DC143C',
      main: '#DC143C',
      dark: '#DC143C',
      contrastText: '#FFFFFF'
    },
    secondary: {
      light: '#DC143C',
      main: '#DC143C',
      dark: '#DC143C',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#FA8072'
    }
  },
  status: {
    danger: 'orange'
  },
  drawer: {
    default: '#CD5C5C'
  }
});


export default themeRed;
