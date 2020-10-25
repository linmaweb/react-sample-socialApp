import React, { useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import DispatchContext from "../context/DispatchContext";
import { FLASHMESSAGE } from "../reducers/types";

const HomeGuest = ({ history }) => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const appDispatch = useContext(DispatchContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("/register", { username, email, password });
      appDispatch({
        type: FLASHMESSAGE,
        value: "Congrats! Welcome to your new account.",
      });
      history.push(`/profile/${username}`);
    } catch (e) {
      appDispatch({
        type: FLASHMESSAGE,
        value: "There was a problem or the request was cancelled.",
      });
    }
  };

  return (
    <Page title="Welcome" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Welcome</h1>
          <p className="lead text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nisi
            orci, placerat non accumsan a, faucibus vel dui. Suspendisse a
            iaculis eros. Suspendisse potenti. Aliquam malesuada elit libero,
            quis malesuada tortor posuere sed. Phasellus dapibus consectetur
            vulputate. Donec ut erat nisl.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
              />
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default withRouter(HomeGuest);
