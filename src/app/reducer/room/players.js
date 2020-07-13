import { createSlice, createSelector } from '@reduxjs/toolkit';
import { isEmpty, flow, flatten } from 'lodash';
import { propOr, filter, map } from 'lodash/fp';

export const players = createSlice({
  name: 'room/players',
  initialState: [
    // nickname: '',
    // email: '',
    // sockets: []
  ],
  reducers: {
    reset: () => [],
    replace: (state, { payload }) => payload,
    join: (state, action) => {
      const player = state.find(
        player => player.email === action.payload.email
      );

      if (!player) {
        state.push({
          ...action.payload,
          sockets: [action.meta.sid]
        });
      } else {
        player.sockets.push(action.meta.sid);
      }
    },
    disconnect: (state, action) => {
      const player = state.find(player =>
        player.sockets.includes(action.payload.id)
      );

      if (player) {
        player.sockets = player.sockets.filter(id => id !== action.payload.id);
      }
    }
  }
});

export const { join, replace, disconnect, reset } = players.actions;

// Selectors

export const getPlayersSockets = createSelector(
  propOr([], 'room.players'),
  flow(
    map(({ sockets }) => sockets),
    flatten
  )
);

export const getOnlinePlayers = createSelector(
  propOr([], 'room.players'),
  filter(({ sockets }) => !isEmpty(sockets))
);

export const getOfflinePlayers = createSelector(
  propOr([], 'room.players'),
  filter(({ sockets }) => isEmpty(sockets))
);

export default players.reducer;
