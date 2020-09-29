import React, { useState, useEffect, useContext } from "react";
import Page from "./Page";
import StateContext from "../context/StateContext";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Axios from "axios";
import Post from "./Post";

const Home = () => {
  const appState = useContext(StateContext);

  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.post("/getHomeFeed", {
          token: appState.user.token,
        });
        setIsLoading(false);
        setFeed(response.data);
      } catch (e) {
        console.log("There was a problem.");
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page title="Your Feed">
      {feed.length ? (
        <>
          <h2 className="text-center mb-4">The Latest Feed</h2>
          <div className="list-group">
            {feed.map((post) => {
              return <Post post={post} key={post._id} />;
            })}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>
          </h2>
          <p className="lead text-muted text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            posuere viverra velit at venenatis. Etiam commodo ante neque, quis
            aliquam sapien cursus et. Pellentesque blandit turpis vitae leo
            sodales mattis. Suspendisse tempor sodales sapien ac mattis. Nulla
            et tellus ut libero ornare tristique aliquet ac est.
          </p>
        </>
      )}
    </Page>
  );
};

export default Home;
