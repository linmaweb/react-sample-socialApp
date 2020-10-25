import {
  LOGIN,
  LOGOUT,
  FLASHMESSAGE,
  OPENSEARCH,
  CLOSESEARCH,
  TOGGLECHAT,
  CLOSECHAT,
  INCREMENTUNREADCHATCOUNT,
  CLEARUNREADCHATCOUNT,
} from "./types";

const appInitialState = {
  loggedIn: Boolean(localStorage.getItem("socialAppToken")),
  isSearchOpen: false,
  isChatOpen: false,
  unreadChatCount: 0,
  flashMessages: [],
  user: {
    token: localStorage.getItem("socialAppToken"),
    username: localStorage.getItem("socialAppUsername"),
    avatar: localStorage.getItem("socialAppAvatar"),
  },
};

const appReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loggedIn: true,
        user: action.data,
      };

    case LOGOUT:
      return {
        ...state,
        loggedIn: false,
      };

    case FLASHMESSAGE:
      return {
        ...state,
        flashMessages: [...state.flashMessages, action.value],
      };

    case OPENSEARCH:
      return {
        ...state,
        isSearchOpen: true,
      };

    case CLOSESEARCH:
      return {
        ...state,
        isSearchOpen: false,
      };

    case TOGGLECHAT:
      return {
        ...state,
        isChatOpen: !state.isChatOpen,
      };

    case CLOSECHAT:
      return {
        ...state,
        isChatOpen: false,
      };
    case INCREMENTUNREADCHATCOUNT:
      return {
        ...state,
        unreadChatCount: state.unreadChatCount + 1,
      };

    case CLEARUNREADCHATCOUNT:
      return {
        ...state,
        unreadChatCount: 0,
      };

    default:
      return;
  }
};

export { appInitialState, appReducer };
