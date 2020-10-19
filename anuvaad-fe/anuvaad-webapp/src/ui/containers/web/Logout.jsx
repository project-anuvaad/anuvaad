import React from "react";
import CONFIG from '../../../configs/apigw'

class Logout extends React.Component {

    componentDidMount(){
        localStorage.removeItem('token')
        localStorage.removeItem('userDetails')
        window.location.href = CONFIG.BASE_URL+CONFIG.LOGOUT_ENDPOINT+'?'+CONFIG.POST_LOGOUT_URL
    }

  render() {
    return (
      <div></div>
    );
  }
}


export default Logout;
