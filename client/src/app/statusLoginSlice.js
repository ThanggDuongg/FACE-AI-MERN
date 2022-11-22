import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

const statusLoginSlice = createSlice({
  name: "statusLogin",
  initialState,
  reducers: {
    loginstatus: (state) => {
      state.isLoggedIn = true;
    },
    logoutstatus: (state) => {
      state.isLoggedIn = false;
    },
  },
});

const { reducer, actions } = statusLoginSlice;

export const { loginstatus, logoutstatus } = actions;
export default reducer;
