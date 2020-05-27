// Reducer only for Client

import { createSlice } from '@reduxjs/toolkit';
import { Status } from './tables';

export const table = createSlice({
  name: 'table',
  initialState: {
    id: null,
    players: [],
    status: Status.WaitingPlayers,
    points: {},
    cards: [],
    timeout: 0,
    pick: '' // card
  },
  reducers: {
    replace: (state, action) => ({
      ...state,
      ...action.payload
    }),
    tick: state => {
      state.timeout -= 1000;
      if (state.timeout < 0) state.timeout = 0;
    },
    pick: (state, action) => {
      state.pick = action.payload;
    },
    ended: state => ({
      ...state,
      status: Status.Ended,
      cards: [],
      pick: ''
    })
  }
});

export const { replace, deal, tick, pick, round, ended } = table.actions;

export default table.reducer;
