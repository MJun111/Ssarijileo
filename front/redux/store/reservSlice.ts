import { createSlice } from '@reduxjs/toolkit';

interface Reserv {
  nickname: string;
  songId: number;
  isPriority: string;
  title: string;
  singer: string;
}

const initialState = {
  reserv: [] as Reserv[],
};

const reservSlice = createSlice({
  name: 'reserv',
  initialState,
  reducers: {
    setReserv(state, action) {
      state.reserv = action.payload;
    },
  },
});

export const { setReserv } = reservSlice.actions;

export default reservSlice;
