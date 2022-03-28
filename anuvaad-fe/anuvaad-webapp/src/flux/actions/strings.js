module.exports = {
  error: {
    message: {
      email: "Invalid email address",
      emailempty: "Email field must not be empty",
      requiredField: "Required field",
      passwordnomatch: "Passwords do not match",
      passwordlegth: "Password field must not be empty",
      tnc: "You must accept our terms of service",
      loginFailure: "Entered Email or password is wrong. Please try again",
      signupError: "Something went wrong while we tried to sign you in",
      forgotPassword: "Something went wrong while we tried to send password to the given email id",
      createPassword: "Something went wrong while we tried to create password",
      profileError: "Something went wrong while we tried to edit the profile ",
      logoutError: "Something went wrong while trying to logout ",
      deleteError: "Something went wrong while trying to delete the account",
      compareselection: "You must select at-least two results to compare",
      http: {
        422: "A User with same email already exist.",
        400: "Something wrong with the input you supplied, please verify and try again!",
        401: "You are not authorized to do this action at the moment!",
        default: "Something went wrong while we process your request. Please try after sometime"
      }
    }
  },
  success: {
    message: {
      login: "You have logged in successfully",
      otpsent: "We have sent you a one time password to your registered email address.",
      signup: "You have successfully registered to Beckers",
      forgotPassword: "Please login with the one time password, received in given email",
      createPassword: "You have successfully changed your password",
      resultsaved: "The result have been saved successfully",
      profileSuccess: "Profile updated successfully",
      logoutSuccess: "Logout successfully",
      deleteSuccess: "Deleted successfully"
    }
  }
};
