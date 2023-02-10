import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reserv: [] as any,
};

const reservSlice = createSlice({
  name: 'reserv',
  initialState,
  reducers: {
    addFirstReserv(state, action) {
      state.reserv.unShift(action.payload);
    },
    addNomalReserv(state, action) {
      state.reserv.push(action.payload);
    },
    deleteReserv(state, action) {
      state.reserv.splict(action.payload, 1);
    },
  },
});

export const { addFirstReserv, addNomalReserv, deleteReserv } =
  reservSlice.actions;

export default reservSlice;
