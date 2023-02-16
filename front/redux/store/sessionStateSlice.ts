import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessionId: '',
  sessionToken: '',
  isHost: false,
};

const sessionStateSlice = createSlice({
  name: 'sessionState',
  initialState,
  reducers: {
    setSessionState(state, action) {
      state.sessionId = action.payload.sessionId;
      state.sessionToken = action.payload.sessionToken;
      state.isHost = action.payload.isHost;
    },
  },
});

export const { setSessionState } = sessionStateSlice.actions;

export default sessionStateSlice;
