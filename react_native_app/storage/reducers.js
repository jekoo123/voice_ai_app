// reducers.js
import {
  ADD_ARRAY1,
  SET_ARRAY1,
  SET_NUMBER,
  SET_ID,
  SAVE_SENTENCE,
  SET_CONTEXT,
} from "./actions";

// const myReducer = (state = [], action) => {
//   switch (action.type) {
//     case "ADD_TO_DATA":
//       return [...state, action.payload];
//     case "DELETE_ALL":
//       return [];
//     default:
//       return state;
//   }
// };
// export default myReducer;

const initialState = {
  array1: [],
  number: 0,
  id: "",
  save: [],
  context: 0,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ARRAY1:
      return { ...state, array1: [...state.array1, action.payload] };
    case SET_ARRAY1:
      return { ...state, array1: action.payload };
    case SET_NUMBER:
      return { ...state, number: action.payload };
    case SET_ID:
      return { ...state, id: action.payload };
    case SAVE_SENTENCE:
      if (state.save.includes(action.payload)) {
        return state;
      } else {
        return {
          ...state,
          save: [...state.save, action.payload],
        };
      }

    case SET_CONTEXT:
      return { ...state, context: action.payload };
    default:
      return state;
  }
}

export default rootReducer;
