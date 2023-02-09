import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  delay: 500000000,
  intensity: 0.5,
  feedback: 0.5,
};

const echoSlice = createSlice({
  name: 'echo',
  initialState,
  reducers: {
    setDelay(state, action) {
      state.delay = action.payload;
    },
    setIntensity(state, action) {
      state.intensity = action.payload;
    },
    setFeedback(state, action) {
      state.feedback = action.payload;
    },
  },
});

export const { setDelay, setIntensity, setFeedback } = echoSlice.actions;

export default echoSlice;
