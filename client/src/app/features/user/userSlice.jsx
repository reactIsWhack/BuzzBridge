import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  acceptFriend,
  createUser,
  declineRequest,
  getPersonalProfile,
  getProfile,
  getUsers,
  login,
  logout,
  getProfilePosts,
} from './userService';
import { toast } from 'react-toastify';
import sortNamesAlphabetically from '../../../utils/sortNamesAlphatbetically';

const basicUserInfo = {
  firstName: '',
  lastName: '',
  userId: '',
  profilePicture: '',
  coverPhoto: '',
  bio: '',
  posts: [],
  friends: [],
  friendRequests: [],
  mutualFriends: [],
  createdAt: '',
};

const initialState = {
  email: '',
  isLoggedIn: false,
  isLoading: false,
  unknownUsers: [],
  ...basicUserInfo,
  profilePicture: 'https://i.ibb.co/4pDNDk1/avatar.png',
  viewingUserProfileInfo: {
    ...basicUserInfo,
    profileLoading: false,
    postsLoading: false,
  },
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
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ formData, navigate }, thunkAPI) => {
    try {
      const response = await login(formData);
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
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const acceptfriendrequest = createAsyncThunk(
  'user/acceptRequest',
  async (userId, thunkAPI) => {
    try {
      const response = await acceptFriend(userId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || error.response.data.message
      );
    }
  }
);

export const declineFriendRequest = createAsyncThunk(
  'user/declineRequest',
  async (userId, thunkAPI) => {
    try {
      const response = await declineRequest(userId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'user/getProfile',
  async (userId, thunkAPI) => {
    try {
      const response = await getProfile(userId);
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || error.response.data.message
      );
    }
  }
);

export const getUserPosts = createAsyncThunk(
  'user/getPosts',
  async (userId, thunkAPI) => {
    try {
      const {
        user: { viewingUserProfileInfo },
      } = thunkAPI.getState();
      const { length } = viewingUserProfileInfo;
      const dateQuery = length
        ? new Date(viewingUserProfileInfo[length - 1].createdAt)
        : new Date(Date.now());
      const response = await getProfilePosts(userId, dateQuery);
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
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
      .addCase(getLoggedInUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLoggedInUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
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
      .addCase(getLoggedInUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })
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
      )
      .addCase(acceptfriendrequest.fulfilled, (state, action) => {
        state.friendRequests = action.payload.friendRequests;
        state.friends = sortNamesAlphabetically(action.payload.friends);
      })
      .addCase(acceptfriendrequest.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(declineFriendRequest.fulfilled, (state, action) => {
        state.friendRequests = action.payload.friendRequests;
      })
      .addCase(declineFriendRequest.rejected, async (state, action) => {
        toast.error(action.payload);
      })
      .addCase(getUserProfile.pending, (state) => {
        state.viewingUserProfileInfo.profileLoading = true;
        state.viewingUserProfileInfo = basicUserInfo;
      })
      .addCase(
        getUserProfile.fulfilled,
        ({ viewingUserProfileInfo }, { payload }) => {
          viewingUserProfileInfo.profileLoading = false;
          viewingUserProfileInfo.firstName = payload.firstName;
          viewingUserProfileInfo.lastName = payload.lastName;
          viewingUserProfileInfo.userId = payload._id;
          viewingUserProfileInfo.profilePicture = payload.photo;
          viewingUserProfileInfo.coverPhoto = payload.coverPhoto;
          viewingUserProfileInfo.bio = payload.bio;
          viewingUserProfileInfo.friends = payload.friends;
          viewingUserProfileInfo.friendRequests = payload.friendRequests;
          viewingUserProfileInfo.createdAt = payload.createdAt;
        }
      )
      .addCase(getUserProfile.rejected, (_, action) => {
        state.viewingUserProfileInfo.profileLoading = false;
        toast.error(action.payload);
      })
      .addCase(getUserPosts.pending, (state) => {
        state.viewingUserProfileInfo.postsLoading = true;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.viewingUserProfileInfo.postsLoading = false;
        state.viewingUserProfileInfo.posts = action.payload;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.viewingUserProfileInfo.postsLoading = false;
        toast.error(error.message);
      });
  },
});

export default userSlice.reducer;

export const { setIsLoggedIn } = userSlice.actions;

export const selectUser = (state) => state.user;
