import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  isAuth: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action) {
      state.isAuth = true;
      state.data = action.payload;
    },
    signOut(state) {
      state.isAuth = false;
      state.data = {};
    },
    userInfo(state, action) {
      state.userInfo = action.payload;
    },
    clearUserInfo(state) {
      state.userInfo = {};
    },
    gridInfo(state, action) {
      state.gridInfo = action.payload;
    },
    clearGridInfo(state) {
      state.gridInfo = {};
    },
  },
});

export const {signIn, signOut, userInfo, clearUserInfo, gridInfo, clearGridInfo } = authSlice.actions;
export default authSlice.reducer;