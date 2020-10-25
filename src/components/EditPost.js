import React, { useEffect, useContext, useReducer } from "react";
import Page from "./Page";
import { useParams, Link, withRouter } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { editInitialState, editReducer } from "../reducers/editReducer";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";
import { FLASHMESSAGE } from "../reducers/types";
import {
  FETCHCOMPLETE,
  TITLECHANGE,
  BODYCHANGE,
  SUBMITREQUEST,
  SAVEREQUESTSTARTED,
  SAVEREQUESTFINISHED,
  TITLERULES,
  BODYRULES,
  NOTFOUND,
} from "../reducers/types";

const EditPost = ({ history }) => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const initialState = {
    ...editInitialState,
    id: useParams().id,
  };

  const [state, dispatch] = useReducer(editReducer, initialState);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({ type: TITLERULES, value: state.title.value });
    dispatch({ type: BODYRULES, value: state.body.value });
    dispatch({ type: SUBMITREQUEST });
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${state.id}`);
        if (response.data) {
          dispatch({ type: FETCHCOMPLETE, value: response.data });
          if (appState.user.username !== response.data.author.username) {
            appDispatch({ type: FLASHMESSAGE, value: "permission denied" });
            history.push("/");
          }
        } else {
          dispatch({ type: NOTFOUND });
        }
      } catch (e) {
        appDispatch({
          type: FLASHMESSAGE,
          value: "There was a problem or the request was cancelled.",
        });
      }
    };
    fetchPost();
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: SAVEREQUESTSTARTED });
      const fetchPost = async () => {
        try {
          await Axios.post(`/post/${state.id}/edit`, {
            title: state.title.value,
            body: state.body.value,
            token: appState.user.token,
          });
          dispatch({ type: SAVEREQUESTFINISHED });
          appDispatch({ type: FLASHMESSAGE, value: "Post was updated." });
          history.push(`/post/${state.id}`);
        } catch (e) {
          appDispatch({
            type: FLASHMESSAGE,
            value: "There was a problem or the request was cancelled.",
          });
        }
      };
      fetchPost();
    }
  }, [state.sendCount]);

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to post permalink
      </Link>

      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onBlur={(e) =>
              dispatch({ type: TITLERULES, value: e.target.value })
            }
            onChange={(e) =>
              dispatch({ type: TITLECHANGE, value: e.target.value })
            }
            value={state.title.value}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onBlur={(e) => dispatch({ type: BODYRULES, value: e.target.value })}
            onChange={(e) =>
              dispatch({ type: BODYCHANGE, value: e.target.value })
            }
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  );
};

export default withRouter(EditPost);
