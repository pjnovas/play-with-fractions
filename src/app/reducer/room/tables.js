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

const waitTimeout = 5000;
const roundTimeout = 15000;

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
    timeout: 0,
    deck: [],
    cards: [],
    tables: [],
    winCard: ''
  },
  reducers: {
    start: identity,
    create: (state, { payload }) => ({
      timeout: waitTimeout,
      deck: payload.deck,
      cards: [],
      tables: payload.tables.map(createTable)
    }),
    replace: (state, { payload }) => ({ ...state, ...payload }),
    deal: (state, { payload }) => ({
      ...state,
      timeout: roundTimeout,
      status: Status.WaitingPicks,
      deck: drop(state.deck, payload),
      cards: take(state.deck, payload),
      winCard: '',
      tables: state.tables.map(table => ({
        ...table,
        picks: {},
        players: table.players.map(player => ({ ...player, state: '' }))
      }))
    }),
    pick: (state, { payload }) => {
      const table = state.tables.find(table => table.id === payload.id);
      if (!table) return state;

      const email = payload.player;
      table.picks[email] = payload.pick;

      const player = table.players.find(player => player.email === email);
      player.state = 'pick';
    },
    round: (state, { payload }) => ({
      ...state,
      timeout: waitTimeout,
      status: Status.EndRound,
      winCard: payload,
      tables: state.tables.map(table => ({
        ...table,
        players: table.players.map(player => ({
          ...player,
          state: table.picks[player.email] === payload ? 'win' : 'loose'
        })),
        points: mapValues(
          table.points,
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

export const getPlayersBySocketIds = createSelector(
  prop('room.players'),
  players =>
    players.reduce(
      (sockets, player) => ({
        ...sockets,
        ...player.sockets.reduce(
          (obj, sid) => ({
            ...obj,
            [sid]: player
          }),
          {}
        )
      }),
      {}
    )
);

export const getTablesBySocketIds = createSelector(
  getPlayersBySocketIds,
  prop('room.tables.tables'),
  (playerSockets, tables) =>
    mapValues(playerSockets, ({ email }) =>
      tables.find(table => table.players.some(player => player.email === email))
    )
);

export default tables.reducer;
