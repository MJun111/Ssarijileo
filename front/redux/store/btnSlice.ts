import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  btn: '',
};

const btnSlice = createSlice({
  name: 'btn',
  initialState,
  reducers: {
    setBtn(state, action) {
      state.btn = action.payload;
    },
  },
});

export const { setBtn } = btnSlice.actions;

export default btnSlice;
