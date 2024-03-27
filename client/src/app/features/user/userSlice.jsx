import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUser, getPersonalProfile, logout } from './userService';
import { toast } from 'react-toastify';
import defaultProfile from '../../../assets/defaultProfile.png';

const initialState = {
  name: '',
  email: '',
  userId: '',
  profilePicture: defaultProfile,
  coverPhoto: '',
  posts: [],
  friends: [],
  mutualFriends: [],
  createdAt: '',
  isLoggedIn: false,
  isLoading: false,
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ formData, navigate }, thunkAPI) => {
    try {
      const response = await createUser(formData);

      response.status === 201 && navigate('/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getLoggedInUserProfile = createAsyncThunk(
  'user/getPersonalProfile',
  async (_, thunkAPI) => {
    try {
      const { data } = await getPersonalProfile();
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/lougoutUser',
  async (navigate, thunkAPI) => {
    try {
      const response = await logout();
      console.log(response);
      response.status === 200 && navigate('/login');

      return response.data.message;
    } catch (error) {
      thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.createdAt = action.payload.createdAt;
        state.userId = action.payload._id;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })
      .addCase(getLoggedInUserProfile.fulfilled, (state, action) => {
        state.userId = action.payload._id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.friends = action.payload.friends;
        state.posts = action.payload.posts;
        state.profilePicture = action.payload.photo || defaultProfile;
        state.coverPhoto = action.payload.coverPhoto;
      })
      .addCase(getLoggedInUserProfile.rejected, (state, action) =>
        toast.error(action.payload)
      )
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoggedIn = false;
        toast.success(action.payload);
      })
      .addCase(logoutUser.rejected, (state, action) =>
        toast.error(action.payload)
      );
  },
});

export default userSlice.reducer;

export const { setIsLoggedIn } = userSlice.actions;

export const selectUser = (state) => state.user;
