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
    addFirstReserv(state, action) {
      state.reserv.unshift(action.payload);
    },
    addSecondReserv(state, action) {
      state.reserv.splice(1, 0, action.payload);
    },
    addNomalReserv(state, action) {
      state.reserv.push(action.payload);
    },
    deleteReserv(state, action) {
      state.reserv.splice(action.payload, 1);
    },
  },
});

export const { addFirstReserv, addSecondReserv, addNomalReserv, deleteReserv } =
  reservSlice.actions;

export default reservSlice;
