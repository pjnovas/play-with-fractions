// Reducer only for Player client

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { prop } from 'lodash/fp';

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

export const hasStarted = createSelector(prop('table.status'), status =>
  [Status.Started].includes(status)
);

export const isLoading = createSelector(prop('table.status'), status =>
  [Status.WaitingPlayers].includes(status)
);

export const hasEnded = createSelector(prop('table.status'), status =>
  [Status.Ended].includes(status)
);

export default table.reducer;
