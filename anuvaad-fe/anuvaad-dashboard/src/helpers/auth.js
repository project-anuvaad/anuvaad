const Auth = {
  get(item) {
    const user = JSON.parse(localStorage.getItem("user"));
    return user[item];
  },

  isLoggedIn() {
    let response;
    if (localStorage.getItem("user")) {
      response = true;
    } else {
      response = false;
    }
    return response;
  }
};

export default Auth;
