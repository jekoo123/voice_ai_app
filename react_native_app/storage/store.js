// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const Store = configureStore({
  reducer: rootReducer
});

export default Store;
