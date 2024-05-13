import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  renderDeletePostPopup: false,
};

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    setDeletePostPopup(state, action) {
      state.renderDeletePostPopup = action.payload;
    },
  },
});

export default popupSlice.reducer;

export const selectPopup = (state) => state.popup;

export const { setDeletePostPopup } = popupSlice.actions;
