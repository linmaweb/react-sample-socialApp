import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import { useParams, Link, withRouter } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";
import { formatPostDate } from "../config";
import { FLASHMESSAGE } from "../reducers/types";

const ViewSinglePost = ({ history }) => {
  const { id } = useParams();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${id}`);
        setPost(response.data);
        setIsLoading(false);
      } catch (e) {
        appDispatch({
          type: FLASHMESSAGE,
          value: "There was a problem or the request was cancelled.",
        });
      }
    };
    fetchPost();
  }, [id]);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username;
    }
    return false;
  };

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      "Do you really want to delete this post?"
    );
    if (confirmDelete) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: { token: appState.user.token },
        });
        if (response.data === "Success") {
          appDispatch({
            type: FLASHMESSAGE,
            value: "Post was successfully deleted.",
          });

          history.push(`/profile/${appState.user.username}`);
        }
      } catch (e) {
        appDispatch({
          type: FLASHMESSAGE,
          value: "There was a problem or the request was cancelled.",
        });
      }
    }
  };

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />
            <a
              onClick={deleteHandler}
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by
        <Link to={`/profile/${post.author.username}`}>
          {` ${post.author.username} `}
        </Link>
        on {formatPostDate(post.createdDate)}
      </p>

      <div className="body-content">{post.body}</div>
    </Page>
  );
};

export default withRouter(ViewSinglePost);
