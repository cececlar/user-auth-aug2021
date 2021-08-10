import React from "react";
import axios from "axios";

class Home extends React.Component {
  state = {
    currentUser: null,
    currentUserTasks: [],
  };

  componentDidMount() {
    //make axios call to backend to get currentUser info and set it to state
    const token = sessionStorage.getItem("token");
    console.log(token);
    axios
      .get("/api/users/current", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          currentUser: res.data.currentUser,
          currentUserTasks: res.data.tasks,
        });
      });
  }

  logout = () => {
    sessionStorage.removeItem("token");
    this.props.history.push("/login");
  };

  render() {
    return (
      <div className="user-info">
        <h1>
          Welcome {this.state.currentUser?.first_name}{" "}
          {this.state.currentUser?.last_name}
        </h1>
        {this.state.currentUserTasks?.map((task) => {
          return <p key={task.id}>{task.description}</p>;
        })}
        <button type="button" onClick={this.logout}>
          Log out
        </button>
      </div>
    );
  }
}

export default Home;
