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
} from "./types";

const editInitialState = {
  title: {
    value: "",
    hasErrors: false,
    message: "",
  },
  body: {
    value: "",
    hasErrors: false,
    message: "",
  },
  isFetching: true,
  isSaving: false,
  sendCount: 0,
  notFound: false,
};

const editReducer = (state, action) => {
  switch (action.type) {
    case FETCHCOMPLETE:
      return {
        ...state,
        title: {
          ...state.title,
          value: action.value.title,
        },
        body: {
          ...state.body,
          value: action.value.body,
        },
        isFetching: false,
      };

    case TITLECHANGE:
      return {
        ...state,
        title: {
          ...state.title,
          value: action.value,
          hasErrors: false,
        },
      };

    case BODYCHANGE:
      return {
        ...state,
        body: {
          ...state.body,
          value: action.value,
          hasErrors: false,
        },
      };

    case SUBMITREQUEST:
      if (!state.title.hasErrors && !state.body.hasErrors) {
        return { ...state, sendCount: state.sendCount + 1 };
      }
      break;

    case SAVEREQUESTSTARTED:
      return { ...state, isSaving: true };

    case SAVEREQUESTFINISHED:
      return { ...state, isSaving: false };

    case TITLERULES:
      if (!action.value.trim()) {
        return {
          ...state,
          title: {
            ...state.title,
            hasErrors: true,
            message: "You must provide a title.",
          },
        };
      }
      break;

    case BODYRULES:
      if (!action.value.trim()) {
        return {
          ...state,
          body: {
            ...state.body,
            hasErrors: true,
            message: "You must provide body content.",
          },
        };
      }
      break;

    case NOTFOUND:
      return {
        ...state,
        notFound: true,
      };

    default:
      return;
  }
};

export { editInitialState, editReducer };
