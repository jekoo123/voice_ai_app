import {
  ADD_DIALOG,
  SET_DIALOG,
  ADD_USER,
  SET_USER,
  CHANGE_LANGUAGE,
  CHANGE_CONTEXT,
  SET_SAVE,
  SETTING_SAVE,
  DELETE_SAVE,
  SET_GRA_SCORE,
  SET_PRO_SCORE,
  SET_DIA_SCORE,
  SET_CREDIT,
  SET_ITEM,
  ADD_ITEM,
  SET_POINT,
  EQUIP,
  RESET_STATE,
} from "./actions";

const initialState = {
  DIALOG: [],
  USER: [],
  SAVE: [],
  PRO_SCORE: [],
  GRA_SCORE: 0,
  DIA_SCORE: 0,
  CREDIT: 0,
  ITEM: [],
  EQUIP: 0,
  POINT: 0,
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
      return { ...state, USER: temp1 };
    case CHANGE_CONTEXT:
      const temp2 = [...state.USER];
      temp2[2] = action.payload;
      return { ...state, USER: temp2 };
    case SETTING_SAVE:
      return { ...state, SAVE: action.payload };
    case SET_SAVE:
      if (state.SAVE.includes(action.payload)) {
        return state;
      } else {
        return {
          ...state,
          SAVE: [...state.SAVE, action.payload],
        };
      }
    case DELETE_SAVE:
      return {
        ...state,
        SAVE: state.SAVE.filter((item) => item !== action.payload),
      };
    case SET_PRO_SCORE:
      return { ...state, PRO_SCORE: [...state.PRO_SCORE, action.payload] };
    case SET_GRA_SCORE:
      return { ...state, GRA_SCORE: action.payload };
    case SET_DIA_SCORE:
      return { ...state, DIA_SCORE: action.payload };
    case SET_CREDIT:
      return { ...state, CREDIT: action.payload };
    case SET_ITEM:
      return { ...state, ITEM: action.payload };
    case ADD_ITEM:
      return { ...state, ITEM: [...state.ITEM, action.payload] };
    case SET_POINT:
      return { ...state, POINT: action.payload };
    case EQUIP:
      return { ...state, EQUIP: action.payload };
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
}

export default rootReducer;
