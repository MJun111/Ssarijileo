import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  like: '찜목록',
};

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    setLike(state, action) {
      state.like = action.payload;
    },
  },
});

export const { setLike } = likeSlice.actions;

export default likeSlice;
