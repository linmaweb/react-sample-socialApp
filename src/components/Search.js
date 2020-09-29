import React, { useState, useEffect, useContext } from "react";
import DispatchContext from "../context/DispatchContext";
import Axios from "axios";
import Post from "./Post";

const Search = () => {
  const appDispatch = useContext(DispatchContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [show, setShow] = useState("neither");
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const searchKeyPressHandler = (e) => {
      if (e.keyCode === 27) {
        appDispatch({ type: "closeSearch" });
      }
    };
    document.addEventListener("keyup", searchKeyPressHandler);
    return () => document.removeEventListener("keyup", searchKeyPressHandler);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      setShow("loading");
      const delay = setTimeout(() => {
        setRequestCount((count) => count + 1);
      }, 750);
      return () => clearTimeout(delay);
    } else {
      setShow("neither");
    }
  }, [searchTerm]);

  useEffect(() => {
    if (requestCount) {
      const fetchResults = async () => {
        try {
          const response = await Axios.post("/search", { searchTerm });
          setResults(response.data);
          setShow("results");
        } catch (e) {
          appDispatch({
            type: "flashMessage",
            value: "There was a problem or the request was cancelled.",
          });
        }
      };
      fetchResults();
    }
  }, [requestCount]);

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
          />
          <span
            onClick={() => appDispatch({ type: "closeSearch" })}
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (show === "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (show === "results" ? "live-search-results--visible" : "")
            }
          >
            {Boolean(results.length) ? (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({results.length}
                  {results.length > 1 ? "items" : "item"} found)
                </div>
                {results.map((post) => {
                  return (
                    <Post
                      post={post}
                      key={post._id}
                      onClick={() => appDispatch({ type: "closeSearch" })}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="alert alert-danger text-center shadow-sm">
                Sorry, we could not find any results for that search.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
