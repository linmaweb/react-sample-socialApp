import React, { useState, useEffect, useContext } from "react";
import Page from "./Page";
import {
  useParams,
  NavLink,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import Axios from "axios";
import StateContext from "../context/StateContext";
import { profileAvatar } from "../config";
import ProfilePosts from "./ProfilePosts";
import ProfileFollow from "./ProfileFollow";

const Profile = ({ history }) => {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [followActionLoading, setFollowActionLoading] = useState(false);
  const [startFollowing, setStartFollowing] = useState(0);
  const [stopFollowing, setStopFollowing] = useState(0);
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar,
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.post(`/profile/${username}`, {
          token: appState.user.token,
        });
        setProfileData(response.data);
      } catch (e) {
        console.log("There was a problem.");
      }
    };
    fetchData();
  }, [username]);

  useEffect(() => {
    if (startFollowing) {
      setFollowActionLoading(true);
      const fetchData = async () => {
        try {
          await Axios.post(`/addFollow/${profileData.profileUsername}`, {
            token: appState.user.token,
          });

          setProfileData({
            ...profileData,
            isFollowing: true,
            counts: {
              ...profileData.counts,
              followerCount: profileData.counts.followerCount++,
            },
          });
          setFollowActionLoading(false);
          history.push(`/profile/${appState.user.username}/following`);
        } catch (e) {
          console.log("There was a problem.");
        }
      };
      fetchData();
    }
  }, [startFollowing]);

  useEffect(() => {
    if (stopFollowing) {
      setFollowActionLoading(true);
      const fetchData = async () => {
        try {
          await Axios.post(`/removeFollow/${profileData.profileUsername}`, {
            token: appState.user.token,
          });
          setProfileData({
            ...profileData,
            isFollowing: false,
            counts: {
              ...profileData.counts,
              followerCount: profileData.counts.followerCount--,
            },
          });
          setFollowActionLoading(false);
          history.push(`/profile/${appState.user.username}/following`);
        } catch (e) {
          console.log("There was a problem.");
        }
      };
      fetchData();
    }
  }, [stopFollowing]);

  const isOwnerFollowing = (follow) => {
    const isOwner =
      appState.loggedIn &&
      appState.user.username != profileData.profileUsername &&
      profileData.profileUsername != "...";

    if (follow) {
      return isOwner && profileData.isFollowing;
    } else {
      return isOwner && !profileData.isFollowing;
    }
  };

  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} />
        {profileData.profileUsername}
        {isOwnerFollowing(false) && (
          <button
            onClick={() => setStartFollowing(startFollowing + 1)}
            disabled={followActionLoading}
            className="btn btn-primary btn-sm ml-2"
          >
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {isOwnerFollowing(true) && (
          <button
            onClick={() => setStopFollowing(stopFollowing + 1)}
            disabled={followActionLoading}
            className="btn btn-danger btn-sm ml-2"
          >
            Stop Following <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink
          exact
          to={`/profile/${profileData.profileUsername}`}
          className="nav-item nav-link"
        >
          Posts: {profileData.counts.postCount}
        </NavLink>
        <NavLink
          to={`/profile/${profileData.profileUsername}/followers`}
          className="nav-item nav-link"
        >
          Followers: {profileData.counts.followerCount}
        </NavLink>
        <NavLink
          to={`/profile/${profileData.profileUsername}/following`}
          className="nav-item nav-link"
        >
          Following: {profileData.counts.followingCount}
        </NavLink>
      </div>

      <Switch>
        <Route exact path="/profile/:username">
          <ProfilePosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollow follow="followers" />
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollow follow="following" />
        </Route>
      </Switch>
    </Page>
  );
};

export default withRouter(Profile);
