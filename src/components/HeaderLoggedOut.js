import React, { useState, useContext } from "react";
import Axios from "axios";
import DispatchContext from "../context/DispatchContext";
import { LOGIN, FLASHMESSAGE } from "../reducers/types";

const HeaderLoggedOut = () => {
  const appDispatch = useContext(DispatchContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/login", { username, password });
      if (response.data) {
        appDispatch({ type: LOGIN, data: response.data });
        appDispatch({
          type: FLASHMESSAGE,
          value: "You have successfully logged in.",
        });
      } else {
        appDispatch({
          type: FLASHMESSAGE,
          value: "Invalid username / password.",
        });
      }
    } catch (e) {
      appDispatch({
        type: FLASHMESSAGE,
        value: "There was a problem or the request was cancelled",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};

export default HeaderLoggedOut;
