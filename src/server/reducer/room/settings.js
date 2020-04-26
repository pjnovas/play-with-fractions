import { createSlice } from '@reduxjs/toolkit';

const cards = [
  // '1',
  // '3/2',
  // '1/3',
  // '4/3',
  // '1/4',
  // '5/4',
  // '3/4',
  // '2/5',
  // '3/5',
  // '4/5',
  // '1/8',
  // '2/8',
  // '3/8',
  // '5/8',
  // '7/8',
  // '9/8',
  // '1/6',
  // '2/6',
  // '3/6',
  // '5/6',
  // '9/6',
  // '8/9',
  // '6/10',
  // '6/12'
];

export const settings = createSlice({
  name: 'settings',
  initialState: {
    id: 'XYZ',
    cards,
    maxPlayers: 0,
    maxPerTable: 0
  },
  reducers: {
    setPlayers: (state, action) => {
      state.maxPlayers = Number(action.payload) || 0;
    },
    setPerTable: (state, action) => {
      state.maxPerTable = Number(action.payload) || 0;
    }
  }
});

export const { setPlayers } = settings.actions;

export default settings.reducer;