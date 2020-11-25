import React from "react";
import history from "../../../web.history";
class Logout extends React.Component {

    componentDidMount(){
        localStorage.removeItem('token')
        localStorage.removeItem('userDetails')
        localStorage.removeItem('userProfile')
        localStorage.removeItem('roles')
        history.push(`${process.env.PUBLIC_URL}/`);
        // window.location.href = '${process.env.PUBLIC_URL}'
    }

  render() {
    return (
      <div></div>
    );
  }
}


export default Logout;
