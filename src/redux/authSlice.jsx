import { createSlice } from '@reduxjs/toolkit';
import { getUser, setUser, removeUser } from '../utils/localStorageUtils';

const initialState = {
  currentUser: getUser(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      setUser(action.payload);
    },
    logOut: state => {
      state.currentUser = null;
      removeUser();
    },
  },
});

export const { setCurrentUser, logOut } = authSlice.actions;
export default authSlice.reducer;
