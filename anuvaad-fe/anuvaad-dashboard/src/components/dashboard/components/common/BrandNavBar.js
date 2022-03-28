import React, { Component } from "react";

/**
 * Brand Navbar Component
 * Holds the brand logo
 */

class BrandNavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-light col-sm-12 col-md-2 col-lg-2 col-xl-2 justifyContent navHeight tabText brandNavBarbuiltBorder brandSection">
        <a className="navbar-brand" href="/home">
          {/*<img className="" src="img/logo.jpeg" width="100" height="50" alt="brand name" />*/}
        </a>
      </nav>
    );
  }
}

export default BrandNavBar;
