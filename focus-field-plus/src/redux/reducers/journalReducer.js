import { RESET_JOURNAL, SAVE_JOURNAL_ENTRY } from "../actions";

const initialState = {
  journalPre: "",
  journalPost: "",
};

const journalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_JOURNAL_ENTRY: {
      const { type, content } = action.payload;
      if (type === "pre") {
        return { ...state, journalPre: content };
      } else if (type === "post") {
        return { ...state, journalPost: content };
      }
      return state;
    }

    case RESET_JOURNAL:
      return initialState;

    default:
      return state;
  }
};

export default journalReducer;
