// Reducer only for Player client

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { prop, pipe, orderBy, map } from 'lodash/fp';

import { Status } from './tables';

const initialState = {
  id: null,
  players: [],
  status: Status.WaitingPlayers,
  points: {},
  cards: [],
  timeout: 0,
  pick: '' // card
};

export const table = createSlice({
  name: 'table',
  initialState,
  reducers: {
    reset: () => initialState,
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

export const { replace, deal, tick, pick, round, ended, reset } = table.actions;

export const hasStarted = createSelector(prop('table.status'), status =>
  [Status.Started].includes(status)
);

export const isLoading = createSelector(prop('table.status'), status =>
  [Status.WaitingPlayers].includes(status)
);

export const hasEnded = createSelector(prop('table.status'), status =>
  [Status.Ended].includes(status)
);

export const tablePlayers = createSelector(
  prop('table'),
  prop('player'),
  ({ players, points }, me) =>
    pipe(
      map(({ email, nickname, state }) => ({
        nickname,
        points: points[email],
        me: email === me.email,
        state
      })),
      orderBy(['points', 'nickname'], ['desc', 'asc'])
    )(players)
);

export default table.reducer;
