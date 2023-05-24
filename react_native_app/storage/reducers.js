// reducers.js
import { ADD_ARRAY1, SET_ARRAY1, SET_NUMBER } from "./actions";

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
};

function rootReducer(state = initialState, action) {
  console.log("rootReducer", action);
  switch (action.type) {
    case ADD_ARRAY1:
      return { ...state, array1: [...state.array1, action.payload] };
    case SET_ARRAY1:
      return { ...state, array1: action.payload };
    case SET_NUMBER:
      return { ...state, number: action.payload };
    default:
      return state;
  }
}

export default rootReducer;
