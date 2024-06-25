import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addPost,
  createComment,
  delComment,
  deleteContent,
  eComment,
  editContent,
  getPosts,
  like,
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

    try {
      const response = await getPosts(
        !posts.posts.length
          ? new Date(Date.now())
          : posts.posts[posts.posts.length - 1].createdAt
      );

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

export const likeContent = createAsyncThunk(
  'posts/likeContent',
  async ({ id, contentData, postId }, thunkAPI) => {
    try {
      const response = await like(id, contentData);
      return { data: response.data, content: contentData.content, postId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/createComment',
  async ({ id, commentMessage }, thunkAPI) => {
    try {
      const response = await createComment(id, commentMessage);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ postId, commentId }) => {
    try {
      const response = await delComment(postId, commentId);
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editPost = createAsyncThunk(
  'posts/editPost',
  async ({ contentId, contentData }, thunkAPI) => {
    try {
      const response = await editContent(contentId, contentData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editComment = createAsyncThunk(
  'comments/editComment',
  async ({ commentId, commentData, updatedPostId }, thunkAPI) => {
    try {
      console.log(commentData);
      const response = await eComment(commentId, commentData);
      console.log(response);
      return { data: response.data, postId: updatedPostId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
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
      .addCase(likeContent.fulfilled, (state, action) => {
        const likedId = action.payload.postId;
        console.log(likedId);
        const likedPost = state.posts.find(
          (post) => String(post._id) === String(likedId)
        );
        if (action.payload.content === 'post') {
          likedPost.likes = action.payload.data.likes;
        } else {
          const likedComment = likedPost.comments.find(
            (comment) => String(comment._id) === String(action.payload.data._id)
          );
          likedComment.likes = action.payload.data.likes;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const commentedPostId = action.payload.data._id;
        const commentedPost = state.posts.find(
          (post) => String(post._id) === String(commentedPostId)
        );
        console.log(commentedPost);
        commentedPost.comments = action.payload.data.comments;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const updatedPost = state.posts.find(
          (post) => String(post._id) === String(action.payload._id)
        );
        updatedPost.comments = action.payload.comments;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const editedPost = state.posts.find(
          (post) => String(post._id) === String(action.payload._id)
        );
        editedPost.postMessage = action.payload.postMessage;
        editedPost.img = action.payload.img;
        editedPost.updatedPost = action.payload.updatedAt;
      })
      .addCase(editPost.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const { data, postId } = action.payload;
        const updatedPost = state.posts.find(
          (post) => String(post._id) === String(postId)
        );
        const updatedComment = updatedPost.comments.find(
          (comment) => String(comment._id) === String(data._id)
        );
        updatedComment.commentMessage = data.commentMessage;
      })
      .addCase(editComment.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export default postsSlice.reducer;

export const { removePost, setDeletedPostId, resetPosts } = postsSlice.actions;

export const selectPosts = (state) => state.posts;
