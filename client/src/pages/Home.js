import React from "react";
import axios from "axios";

class Home extends React.Component {
  state = {
    currentUser: null,
  };

  componentDidMount() {
    //make axios call to backend to get currentUser info and set it to state
    const token = sessionStorage.getItem("token");
    axios
      .get("/api/users/current", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => this.setState({ currentUser: res.data }));
  }

  render() {
    return (
      <div>
        <h1>
          Welcome Back {this.state.currentUser?.first_name}{" "}
          {this.state.currentUser?.last_name}
        </h1>
      </div>
    );
  }
}

export default Home;
