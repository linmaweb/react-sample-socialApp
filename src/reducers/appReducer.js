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
    case "login":
      return {
        ...state,
        loggedIn: true,
        user: action.data,
      };
    case "logout":
      return {
        ...state,
        loggedIn: false,
      };
    case "flashMessage":
      return {
        ...state,
        flashMessages: [...state.flashMessages, action.value],
      };

    case "openSearch":
      return {
        ...state,
        isSearchOpen: true,
      };
    case "closeSearch":
      return {
        ...state,
        isSearchOpen: false,
      };
    case "toggleChat":
      return {
        ...state,
        isChatOpen: !state.isChatOpen,
      };
    case "closeChat":
      return {
        ...state,
        isChatOpen: false,
      };
    case "incrementUnreadChatCount":
      return {
        ...state,
        unreadChatCount: state.unreadChatCount + 1,
      };
    case "clearUnreadChatCount":
      return {
        ...state,
        unreadChatCount: 0,
      };
  }
};

export { appInitialState, appReducer };
