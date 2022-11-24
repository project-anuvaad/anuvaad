import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { logOut } from '../../../../flux/actions/users/logout';

class Logout extends React.Component {

    componentDidMount(){
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


