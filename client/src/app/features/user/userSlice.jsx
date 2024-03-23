import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  profilePicture: '',
  coverPhoto: '',
  posts: [],
  friends: [],
  mutualFriends: [],
  createdAt: '',
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setIsLoggedIn } = userSlice.actions;

export const selectUser = (state) => state.user;
