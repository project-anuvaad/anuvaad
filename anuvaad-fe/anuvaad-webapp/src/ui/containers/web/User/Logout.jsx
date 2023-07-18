import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { logOut } from '../../../../flux/actions/users/logout';
import LogoutAPI from "../../../../flux/actions/apis/user/logout";

class Logout extends React.Component {

  componentDidMount() {
    let userName = JSON.parse(localStorage.getItem('userProfile'))?.userName;

    userName && localStorage.getItem('token') ? this.makeLogoutAPICall() : this.redirectToLogin();
  }

  makeLogoutAPICall = (userName) => {
    const apiObj = new LogoutAPI(userName)

    fetch(apiObj.apiEndPoint(), {
      method: 'POST',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(res => {
      let response = res.json();
      // console.log("response --- ", response);
      if (response.ok) {
        this.redirectToLogin()
      }
    })
      .catch(err => {
        console.log(err);
      });
  }

  redirectToLogin = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userDetails')
    localStorage.removeItem('userProfile')
    localStorage.removeItem('roles')
    this.props.logOut()
    // history.push(`${process.env.PUBLIC_URL}/`);
    window.location.href = `${process.env.PUBLIC_URL}/user/login`
  }

  render() {
    return (
      <div></div>
    );
  }
}


const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      logOut
    },
    dispatch
  );

export default withRouter(

  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Logout)

);


