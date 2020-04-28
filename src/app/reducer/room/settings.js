import { createSlice } from '@reduxjs/toolkit';
import shortid from 'shortid';

export const settings = createSlice({
  name: 'room/settings',
  initialState: {
    id: null,
    name: '',
    cards: [],
    maxPlayers: 20,
    maxPerTable: 4
  },
  reducers: {
    create: (state, { payload }) => ({
      id: shortid.generate(),
      ...payload
    }),
    replace: (state, { payload }) => payload
  }
});

export const { create, replace } = settings.actions;

export const notFound = id => ({
  type: `${settings.name}/notFound`,
  error: true,
  payload: {
    id,
    code: 404,
    message: 'Room not found'
  }
});

export default settings.reducer;
