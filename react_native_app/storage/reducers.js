import {
  ADD_DIALOG,
  SET_DIALOG,
  ADD_USER,
  SET_USER,
  CHANGE_LANGUAGE,
  CHANGE_CONTEXT,
  SET_SAVE,
  DELETE_SAVE,
  SET_SCORE
} from "./actions";

const initialState = {
  DIALOG: [],
  USER: [],
  SAVE: [],
  SCORE: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_DIALOG:
      return { ...state, DIALOG: [...state.DIALOG, action.payload] };
    case SET_DIALOG:
      return { ...state, DIALOG: action.payload };
    case ADD_USER:
      return { ...state, USER: [...state.USER, action.payload] };
    case SET_USER:
      return { ...state, USER: action.payload };
    case CHANGE_LANGUAGE:
      const temp1 = [...state.USER];
      temp1[1] = action.payload;
      return { ...state, USER: newUser };
    case CHANGE_CONTEXT:
      const temp2 = [...state.USER];
      temp2[2] = action.payload;
      return { ...state, USER: newUser };
    case SET_SAVE:
      if (state.SAVE.includes(action.payload)) {
        return state;
      } else {
        return {
          ...state,
          save: [...state.SAVE, action.payload],
        };
      }
    case DELETE_SAVE:
      return {
        ...state,
        SAVE: state.SAVE.filter((item) => item !== action.payload),
      };
    case SET_SCORE:
      return { ...state, SCORE: [...state.SCORE, action.payload] };
    default:
      return state;
  }
}

export default rootReducer;
