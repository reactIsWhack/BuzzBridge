import {
  configureStore,
  createSerializableStateInvariantMiddleware,
} from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import postsReducer from './features/posts/postsSlice';
import popupReducer from './features/popup/popupSlice';

const middleware = [createSerializableStateInvariantMiddleware()];

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    popup: popupReducer,
    middleware,
  },
});

export default store;
