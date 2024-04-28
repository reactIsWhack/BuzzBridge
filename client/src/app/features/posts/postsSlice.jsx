import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPosts } from './postsService';
import { toast } from 'react-toastify';

const initialState = {
  posts: [],
  postsIsLoading: false,
  queryDates: [],
  noMorePosts: false,
};

export const getAllPosts = createAsyncThunk(
  'posts/getAllPosts',
  async (_, thunkAPI) => {
    const { posts } = thunkAPI.getState();

    if (posts.noMorePosts) return;

    try {
      const response = await getPosts(
        !posts.posts.length
          ? new Date(Date.now())
          : posts.posts[posts.posts.length - 1].createdAt
      );

      if (response.status === 204) {
        thunkAPI.dispatch(setNoMorePosts(true));
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setNoMorePosts(state, action) {
      state.noMorePosts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        if (!state.noMorePosts) {
          state.postsIsLoading = true;
        }
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.postsIsLoading = false;
        state.loadingMorePosts = false;
        if (action.payload.length) {
          state.posts = [...state.posts, ...action.payload];
          state.queryDates.push(
            action.payload[action.payload.length - 1].createdAt
          );
        }
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.postsIsLoading = false;
        toast.error(action.payload);
      });
  },
});

export default postsSlice.reducer;

export const { setNoMorePosts } = postsSlice.actions;

export const selectPosts = (state) => state.posts;
