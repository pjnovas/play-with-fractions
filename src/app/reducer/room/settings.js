import { createSlice } from '@reduxjs/toolkit';
import shortid from 'shortid';

export const settings = createSlice({
  name: 'room/settings',
  initialState: {
    id: null,
    cards: [],
    maxPlayers: 0,
    maxPerTable: 0
  },
  reducers: {
    create: (state, { payload }) => ({
      id: shortid.generate(),
      name: `Untitled`,
      cards: [],
      maxPlayers: 20,
      maxPerTable: 4,
      ...payload
    })
  }
});

export const { create } = settings.actions;

export default settings.reducer;
