const myReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TO_DATA':
      return [...state, action.payload];
      case 'DELETE_ALL':
        return [[]];
    default:
      return state;
  }
};
export default myReducer;