import { combineReducers } from 'redux';
import myReducer from './reducer';

const rootReducer = combineReducers({
  mydata: myReducer,
});

export default rootReducer;