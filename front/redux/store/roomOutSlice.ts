import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOut: false,
};

const roomOutSlice = createSlice({
  name: 'roomOut',
  initialState,
  reducers: {
    setRoomOut(state, action) {
      state.isOut = action.payload.isOut;
    },
  },
});

export const { setRoomOut } = roomOutSlice.actions;

export default roomOutSlice;
