import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessionId: '',
};

const sessionIdSlice = createSlice({
  name: 'sessionId',
  initialState,
  reducers: {
    setSessionId(state, action) {
      state.sessionId = action.payload;
    },
  },
});

export const { setSessionId } = sessionIdSlice.actions;

export default sessionIdSlice;
