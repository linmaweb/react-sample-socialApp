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
    case "fetchComplete":
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

    case "titleChange":
      return {
        ...state,
        title: {
          ...state.title,
          value: action.value,
          hasErrors: false,
        },
      };

    case "bodyChange":
      return {
        ...state,
        body: {
          ...state.body,
          value: action.value,
          hasErrors: false,
        },
      };

    case "submitRequest":
      if (!state.title.hasErrors && !state.body.hasErrors) {
        return { ...state, sendCount: state.sendCount + 1 };
      }

    case "saveRequestStarted":
      return { ...state, isSaving: true };

    case "saveRequestFinished":
      return { ...state, isSaving: false };

    case "titleRules":
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

    case "bodyRules":
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

    case "notFound":
      return {
        ...state,
        notFound: true,
      };

    default:
      return;
  }
};

export { editInitialState, editReducer };
