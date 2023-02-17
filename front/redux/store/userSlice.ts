import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nickname: '' as string,
  img: '' as string,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setNickname(state, action) {
      state.nickname = action.payload;
    },
    setImg(state, action) {
      state.img = action.payload;
    },
  },
});

export const { setNickname, setImg } = userSlice.actions;

export default userSlice;
