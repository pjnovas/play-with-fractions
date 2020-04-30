import { createSlice, createSelector } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { prop, find } from 'lodash/fp';

export const players = createSlice({
  name: 'room/players',
  initialState: [
    // nickname: '',
    // email: '',
    // sockets: []
  ],
  reducers: {
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

export const { join, replace, disconnect } = players.actions;

// Selectors

export const isPlayerOnline = email =>
  createSelector(
    prop('players'),
    find({ email }),
    player => !isEmpty(player.sockets)
  );

export default players.reducer;
