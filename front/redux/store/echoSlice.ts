import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  echo: 0.5,
};

const echoSlice = createSlice({
  name: 'echo',
  initialState,
  reducers: {
    setEcho(state, action) {
      state.echo = action.payload;
    },
  },
});

export const { setEcho } = echoSlice.actions;

export default echoSlice;
