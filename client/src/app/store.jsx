import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import postsReducer from './features/posts/postsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
  },
});

export default store;
