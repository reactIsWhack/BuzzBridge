import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import postsReducer from './features/posts/postsSlice';
import popupReducer from './features/popup/popupSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    popup: popupReducer,
  },
});

export default store;
