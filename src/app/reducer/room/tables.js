import { createSlice, createSelector } from '@reduxjs/toolkit';
import { take, drop, identity, mapValues, keyBy } from 'lodash';
import { prop } from 'lodash/fp';
import shortid from 'shortid';

export const Status = {
  WaitingPlayers: 'WAITING_PLAYERS',
  WaitingPicks: 'WAITING_PICKS',
  EndRound: 'END_ROUND',
  Ended: 'ENDED'
};

const createTable = ({ players }) => ({
  id: shortid.generate(),
  players,
  points: players.reduce(
    (points, player) => ({
      ...points,
      [player.email]: 0
    }),
    {}
  ),
  picks: {}
});

export const tables = createSlice({
  name: 'room/tables',
  initialState: {
    status: Status.WaitingPlayers,
    deck: [],
    cards: [],
    tables: []
  },
  reducers: {
    start: identity,
    create: (state, { payload }) => ({
      deck: payload.deck,
      cards: [],
      tables: payload.tables.map(createTable)
    }),
    replace: (state, { payload }) => ({ ...state, ...payload }),
    deal: (state, { payload }) => ({
      ...state,
      status: Status.WaitingPicks,
      deck: drop(state.deck, payload),
      cards: take(state.deck, payload),
      tables: state.tables.map(table => ({ ...table, picks: {} }))
    }),
    pick: (state, { payload }) => {
      const table = state.tables.find(table => table.id === payload.id);
      if (!table) return state;
      table.picks[payload.player] = payload.pick; // payload.player = email
    },
    round: (state, { payload }) => ({
      status: Status.EndRound,
      tables: state.tables.map(table => ({
        ...table,
        points: mapValues(
          (points, player) => points + (table.picks[player] === payload ? 1 : 0)
        )
      }))
    }),
    ended: identity
  }
});

export const {
  start,
  create,
  replace,
  deal,
  pick,
  round,
  ended
} = tables.actions;

// Selectors

export const getSocketIdsByTableId = createSelector(
  prop('room.players'),
  prop('room.tables.tables'),
  (players, tables) =>
    mapValues(keyBy(tables, 'id'), table =>
      table.players.reduce(
        (sockets, { email }) => [
          ...sockets,
          ...(players.find(pl => pl.email === email).sockets || [])
        ],
        []
      )
    )
);

export default tables.reducer;
