import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  renderDeletePostPopup: false,
  renderPostFormModal: {
    render: false,
    editing: false,
    editedPost: null,
  },
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
  },
});

export default popupSlice.reducer;

export const selectPopup = (state) => state.popup;

export const { setDeletePostPopup, setRenderPostFormModal } =
  popupSlice.actions;
