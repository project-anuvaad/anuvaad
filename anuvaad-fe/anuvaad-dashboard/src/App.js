import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Router from "./Router";


class App extends Component {
  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   theme: '',
  //   // }
  //   // document.documentElement.setAttribute("data-theme", this.state.theme);
  // }

  // componentDidMount() {
  //   // this.toggleTheme();
  // }

  /**
    * Function to toggle between the light and dark mode
    */
  // toggleTheme() {
  //     const theme = localStorage.getItem("currentTheme") === null ? 'dark' : 'light';
  //     this.setState({ theme });
  //     document.documentElement.setAttribute("data-theme", theme);
  // }

  render() {
    return (
      <div>
        <Router />
      </div>
    )
  }
}

export default App;
