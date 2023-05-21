import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer/rootReducer';

const Store = configureStore({
  reducer: rootReducer
});

export default Store;