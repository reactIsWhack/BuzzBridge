import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createUser,
  getPersonalProfile,
  getUsers,
  login,
  logout,
} from './userService';
import { toast } from 'react-toastify';
import defaultProfile from '../../../assets/defaultProfile.png';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  userId: '',
  profilePicture: 'https://i.ibb.co/4pDNDk1/avatar.png',
  coverPhoto: '',
  bio: '',
  posts: [],
  friends: [],
  friendRequests: [],
  mutualFriends: [],
  createdAt: '',
  isLoggedIn: false,
  isLoading: false,
  unknownUsers: [],
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
      console.log(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ formData, navigate }, thunkAPI) => {
    try {
      const response = await login(formData);
      console.log(response);
      if (response.status === 200) {
        navigate('/');
      }

      return response.data;
    } catch (error) {
      console.log(error, 'error');
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/lougoutUser',
  async (navigate, thunkAPI) => {
    try {
      const response = await logout();
      response.status === 200 && navigate('/login');
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getUnkownUsers = createAsyncThunk(
  'user/getUnkownUsers',
  async (_, thunkAPI) => {
    try {
      const response = await getUsers();
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
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
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.createdAt = action.payload.createdAt;
        state.userId = action.payload._id;
        state.isLoggedIn = true;
        state.profilePicture = action.payload.photo;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })
      .addCase(getLoggedInUserProfile.fulfilled, (state, action) => {
        state.userId = action.payload._id;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.bio = action.payload.bio;
        state.friends = action.payload.friends;
        state.friendRequests = action.payload.friendRequests;
        state.posts = action.payload.posts;
        state.profilePicture = action.payload.photo;
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
      )
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.friends = action.payload.friends;
        state.friendRequests = action.payload.friendRequests;
        state.bio = action.payload.bio;
        state.photo = action.payload.photo;
        state.posts = action.payload.posts;
        state.coverPhoto = action.payload.coverPhoto;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })
      .addCase(getUnkownUsers.fulfilled, (state, action) => {
        state.unknownUsers = action.payload;
      })
      .addCase(getUnkownUsers.rejected, (state, action) =>
        toast.error(action.payload)
      );
  },
});

export default userSlice.reducer;

export const { setIsLoggedIn } = userSlice.actions;

export const selectUser = (state) => state.user;
