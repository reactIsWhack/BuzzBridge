import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPosts } from './postsService';
import { toast } from 'react-toastify';

const initialState = {
  posts: [],
  postsIsLoading: false,
};

export const getAllPosts = createAsyncThunk(
  'posts/getAllPosts',
  async (_, thunkAPI) => {
    try {
      const { user, posts } = thunkAPI.getState();
      const response = await getPosts(user.posts.length, posts.posts.length);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.postsIsLoading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.postsIsLoading = false;
        state.posts = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.postsIsLoading = false;
        toast.error(action.payload);
      });
  },
});

export default postsSlice.reducer;

export const selectPosts = (state) => state.posts;
