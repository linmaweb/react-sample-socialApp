import React, { useState, useEffect, useContext, useRef } from "react";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";
import { databaseUrl } from "../config";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const socket = io(databaseUrl);

const Chat = () => {
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [fieldValue, setFieldValue] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    socket.on("chatFromServer", (message) => {
      setChatMessages([...chatMessages, message]);
    });
  }, [chatMessages]);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (chatMessages.length && !appState.isChatOpen) {
      appDispatch({ type: "incrementUnreadChatCount" });
    }
  }, [chatMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("chatFromBrowser", {
      message: fieldValue,
      token: appState.user.token,
    });

    setChatMessages([
      ...chatMessages,
      {
        message: fieldValue,
        username: appState.user.username,
        avatar: appState.user.avatar,
      },
    ]);
    setFieldValue("");
  };

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (appState.isChatOpen ? "chat-wrapper--is-visible" : "")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          onClick={() => appDispatch({ type: "closeChat" })}
          className="chat-title-bar-close"
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {chatMessages.map((message, index) => {
          if (message.username === appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img
                  className="chat-avatar avatar-tiny"
                  src={message.avatar}
                  alt={message.username}
                />
              </div>
            );
          }

          return (
            <div key={index} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img
                  className="avatar-tiny"
                  src={message.avatar}
                  alt={message.username}
                />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          ref={chatField}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default Chat;
