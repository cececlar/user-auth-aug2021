import React from "react";
import axios from "axios";

class Login extends React.Component {
  state = {
    formData: null,
  };

  handleChange = (e) => {
    this.setState({
      formData: { ...this.state.formData, [e.target.name]: e.target.value },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/users/login", this.state.formData)
      .then((res) => {
        this.props.history.push("/");
      })
      .catch((error) => alert(error));
  };

  showSignUp = () => {
    this.props.history.push("/signup");
  };

  render() {
    return (
      <div className="user-info">
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <label>Email</label>
          <input type="email" name="email" onChange={this.handleChange} />
          <label>Password</label>
          <input type="password" name="password" onChange={this.handleChange} />
          <div className="user-form__buttons">
            <button type="submit">Log in</button>
            <button type="button" onClick={this.showSignUp}>
              Sign up
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
