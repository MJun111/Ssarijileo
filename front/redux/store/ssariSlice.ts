import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ssari: 0 as number,
};

const ssariSlice = createSlice({
  name: 'ssari',
  initialState,
  reducers: {
    setSsari(state, action) {
      state.ssari = action.payload;
    },
  },
});

export const { setSsari } = ssariSlice.actions;

export default ssariSlice;
