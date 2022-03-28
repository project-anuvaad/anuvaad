import React, { Component } from "react";
import { UserService } from "../../services/user.service";
import Auth from "../../helpers/auth";
import Notify from "./../../helpers/notify";
import { APP } from "../../constants";

/**
 * Login component
 */

class Login extends Component {
  constructor(props) {
    super(props);
    if (Auth.isLoggedIn()) {
      this.props.history.push("home");
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    // Notify.success('This is a test message.');
  }

  handleSubmit(event) {
    event.preventDefault();
    UserService.login(
      event.target.email.value,
      event.target.password.value
    ).then(
      (response) => {
        if (response.statusInfo.statusCode === APP.CODE.SUCCESS) {
          localStorage.setItem("user", JSON.stringify(response.responseData));
          this.props.history.push("/dashboards");
        } else {
          Notify.error(response.statusInfo.errorMessage);
        }
      },
      (error) => {
        error.statusInfo
          ? Notify.error(error.statusInfo.errorMessage)
          : Notify.error(error.message);
      }
    );
    return;
  }

  render() {
    return (
      <div className="d-md-flex d-lg-flex d-xl-flex fullHeight">
        <div className="col-md-7 d-none d-md-flex d-lg-flex d-xl-flex" style={{
          background:"white"
        }}>
          <img
            className="centerAlign"
            src="img/Anuvaad.png"
            alt="brand cover"
            height="81%"
            width="50%"
          />
        </div>
        <div className="col-md-5 d-md-flex d-lg-flex d-xl-flex loginRightBg fullHeight">
          <div className="centerAlign verticalCenter" style={{ width: "85%" }}>
            <div className="loginForm text-center">
              <form className="form-signin" onSubmit={this.handleSubmit}>
                <h1 className="h4 mb-3 font-weight-normal">Please sign in</h1>
                <label htmlFor="inputEmail" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="inputEmail"
                  name="email"
                  className="form-control"
                  placeholder="Email address"
                  autoFocus={true}
                  required
                />
                <label htmlFor="inputPassword" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  id="inputPassword"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  required
                />
                <button
                  className="btn btn-lg btn-primary btn-block"
                  id="loginBtn"
                  type="submit"
                >
                  Login
                </button>
                {/*<p className="text-center">
                <Link to="login" className="forgot">
                  Forgot password?
                </Link>
              </p>*/}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
