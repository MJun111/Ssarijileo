import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  volume: 1,
};

const volumeSlice = createSlice({
  name: 'volume',
  initialState,
  reducers: {
    setVolume(state, action) {
      state.volume = action.payload;
    },
  },
});

export const { setVolume } = volumeSlice.actions;

export default volumeSlice;
