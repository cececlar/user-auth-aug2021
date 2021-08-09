import React from "react";
import axios from "axios";

class SignUp extends React.Component {
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
      .post("/api/users", this.state.formData)
      .then((res) => {
        sessionStorage.setItem("token", res.data.token);
        this.props.history.push("/");
      })
      .catch((error) => alert(error));
  };

  showLogin = () => {
    this.props.history.push("/login");
  };

  render() {
    return (
      <div className="user-info">
        <h1>Create Account</h1>
        <form onSubmit={this.handleSubmit}>
          <label>First Name:</label>
          <input type="text" name="first_name" onChange={this.handleChange} />
          <label>Last Name:</label>
          <input type="text" name="last_name" onChange={this.handleChange} />
          <label>Email</label>
          <input type="email" name="email" onChange={this.handleChange} />
          <label>Password</label>
          <input type="password" name="password" onChange={this.handleChange} />
          <label>Address:</label>
          <input type="text" name="address" onChange={this.handleChange} />
          <label>Phone Number:</label>
          <input type="text" name="phone" onChange={this.handleChange} />
          <div className="user-form__buttons">
            <button type="submit">Sign up</button>
            <button type="button" onClick={this.showLogin}>
              Log in
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default SignUp;
