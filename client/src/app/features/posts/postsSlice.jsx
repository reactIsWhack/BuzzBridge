import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addPost,
  createComment,
  deleteContent,
  getPosts,
  likeContent,
} from './postsService';
import { toast } from 'react-toastify';

const initialState = {
  posts: [],
  postsIsLoading: false,
  queryDates: [],
  noMorePosts: false,
  deletePostId: '', // keeps track of the id being used to delete a given post
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

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (formData, thunkAPI) => {
    try {
      const response = await addPost(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (_, thunkAPI) => {
    try {
      const { posts } = thunkAPI.getState();
      const response = await deleteContent(posts.deletePostId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async ({ id, contentData }, thunkAPI) => {
    try {
      const response = await likeContent(id, contentData);
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/createComment',
  async ({ id, commentMessage }, thunkAPI) => {
    try {
      console.log(id);
      const response = await createComment(id, commentMessage);
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
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
    removePost(state, action) {
      state.posts = state.posts.filter(
        (post) => String(post._id) !== String(state.deletePostId)
      );
    },
    setDeletedPostId(state, action) {
      state.deletePostId = action.payload;
    },
    resetPosts(state, action) {
      return initialState;
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
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(createPost.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const likedId = action.payload.data._id;
        const likedPost = state.posts.find(
          (post) => String(post._id) === String(likedId)
        );
        likedPost.likes = action.payload.data.likes;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const commentedPostId = action.payload.data._id;
        const commentedPost = state.posts.find(
          (post) => String(post._id) === String(commentedPostId)
        );
        console.log(commentedPost);
        commentedPost.comments = action.payload.data.comments;
      });
  },
});

export default postsSlice.reducer;

export const { setNoMorePosts, removePost, setDeletedPostId, resetPosts } =
  postsSlice.actions;

export const selectPosts = (state) => state.posts;
