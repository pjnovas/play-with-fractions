import { prop, reduce } from 'lodash/fp';
import { createSlice, createSelector } from '@reduxjs/toolkit';

export const sockets = createSlice({
  name: 'sockets',
  initialState: [],
  reducers: {
    replace: (state, { payload }) => payload,
    newConnection: (state, { payload }) => {
      state.push(payload);
    },
    removeClient: (state, { payload }) =>
      state.filter(({ id }) => id !== payload.id)
  }
});

export const { newConnection, removeClient, replace } = sockets.actions;

// Selectors

const reduceById = (key, value) => (all, socket) =>
  socket[key] === value ? [...all, socket.id] : all;

export const getRoomIds = roomId =>
  createSelector(prop(sockets.name), reduce(reduceById('roomId', roomId), []));

export const getTableIds = tableId =>
  createSelector(
    prop(sockets.name),
    reduce(reduceById('tableId', tableId), [])
  );

export const getAdminIds = createSelector(
  prop(sockets.name),
  reduce(reduceById('isAdmin', true), [])
);

export default sockets.reducer;
