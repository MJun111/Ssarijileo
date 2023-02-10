import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  beat: 0.5,
};

const beatSlice = createSlice({
  name: 'beat',
  initialState,
  reducers: {
    setBeat(state, action) {
      state.beat = action.payload;
    },
  },
});

export const { setBeat } = beatSlice.actions;

export default beatSlice;
