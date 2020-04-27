import { prop, reduce } from 'lodash/fp';
import { createSlice, createSelector } from '@reduxjs/toolkit';

export const sockets = createSlice({
  name: 'sockets',
  initialState: [],
  reducers: {
    newConnection: (state, { payload }) => {
      state.push(payload);
    }
  }
});

export const { newConnection } = sockets.actions;

// Selectors

export const getRoomIds = roomId =>
  createSelector(
    prop(sockets.name),
    reduce(
      (all, socket) => (socket.roomId === roomId ? [...all, socket.id] : all),
      []
    )
  );

export const getTableIds = tableId =>
  createSelector(
    prop(sockets.name),
    reduce(
      (all, socket) => (socket.tableId === tableId ? [...all, socket.id] : all),
      []
    )
  );

export const getAdminIds = createSelector(
  prop(sockets.name),
  reduce((all, socket) => (socket.isAdmin ? [...all, socket.id] : all), [])
);

export default sockets.reducer;
