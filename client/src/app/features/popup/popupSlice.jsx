import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  renderDeletePostPopup: false,
  renderPostFormModal: {
    render: false,
    editing: false,
    editedPost: null,
  },
  editedComments: [],
};

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    setDeletePostPopup(state, action) {
      state.renderDeletePostPopup = action.payload;
    },
    setRenderPostFormModal(state, action) {
      state.renderPostFormModal = action.payload;
    },
    setRenderEditCommentForm(state, action) {
      state.editedComments = [...state.editedComments, action.payload];
    },
    removeEditedComment(state, action) {
      state.editedComments = state.editedComments.filter(
        (comment) => String(comment._id) !== String(action.payload) // id of the comment
      );
    },
  },
});

export default popupSlice.reducer;

export const selectPopup = (state) => state.popup;

export const {
  setDeletePostPopup,
  setRenderPostFormModal,
  setRenderEditCommentForm,
  removeEditedComment,
} = popupSlice.actions;
