import React, { useEffect, useReducer } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";
import { appInitialState, appReducer } from "../reducers/appReducer";
import { databaseUrl } from "../config";
import { LOGOUT, FLASHMESSAGE } from "../reducers/types";

//components
import Header from "./Header";
import HomeGuest from "./HomeGuest";
import Home from "./Home";
import Title from "./Title";
import CreatePost from "./CreatePost";
import ViewSinglePost from "./ViewSinglePost";
import FlashMessages from "./FlashMessages";
import Profile from "./Profile";
import EditPost from "./EditPost";
import NotFound from "./NotFound";
import Search from "./Search";
import Chat from "./Chat";
import Footer from "./Footer";
import About from "./About";
import Terms from "./Terms";

const App = () => {
  Axios.defaults.baseURL = databaseUrl;
  const [state, dispatch] = useReducer(appReducer, appInitialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("socialAppToken", state.user.token);
      localStorage.setItem("socialAppUsername", state.user.username);
      localStorage.setItem("socialAppAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("socialAppToken");
      localStorage.removeItem("socialAppUsername");
      localStorage.removeItem("socialAppAvatar");
    }
  }, [state.loggedIn]);

  useEffect(() => {
    if (state.loggedIn) {
      const fetchResults = async () => {
        try {
          const response = await Axios.post("/checkToken", {
            token: state.user.token,
          });
          if (!response.data) {
            dispatch({ type: LOGOUT });
            dispatch({
              type: FLASHMESSAGE,
              value: "Your session has expired. Please log in again.",
            });
          }
        } catch (e) {
          dispatch({
            type: FLASHMESSAGE,
            value: "There was a problem or the request was cancelled.",
          });
        }
      };
      fetchResults();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Title title="Social App" />
          <Header />
          <Switch>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <Search />
          </CSSTransition>
          <Chat />
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default App;
