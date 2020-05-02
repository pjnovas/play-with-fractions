// Reducer only for Client

import { createSlice } from '@reduxjs/toolkit';
import { identity } from 'lodash';
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
    deal: (state, action) => ({
      ...state,
      ...action.payload
    }),
    tick: (state, action) => {
      state.timeout = action.payload;
    },
    pick: (state, action) => {
      state.pick = action.payload;
    },
    round: (state, action) => {
      // action.payload.asserted
      state.points = action.payload.points;
    },
    ended: identity
  }
});

export const { replace, deal, tick, pick, round, ended } = table.actions;

export default table.reducer;
