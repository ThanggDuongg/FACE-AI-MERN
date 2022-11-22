import {
  configureStore
} from "@reduxjs/toolkit";
import userReducer from './userSlice';
import statusLoginReducer from './statusLoginSlice';

const rootReducer = {
  user: userReducer,
  statusLogin: statusLoginReducer
}

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export default store;
