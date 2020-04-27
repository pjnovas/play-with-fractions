import { createSlice } from '@reduxjs/toolkit';
import shortid from 'shortid';

const Status = {
  WaitingPlayers: 'WAITING_PLAYERS',
  WaitingPicks: 'WAITING_PICKS',
  Ended: 'ENDED'
};

const createTable = ({ waitFor = 3 } = {}) => ({
  id: shortid.generate(),
  waitFor: 0,
  players: [],
  state: {
    status: Status.WaitingPlayers,
    points: {},
    nextCards: [],
    tableCards: [],
    cardPicks: {}
  }
});

export const tables = createSlice({
  name: 'room/tables',
  initialState: [],
  reducers: {
    create: (state, action) => {
      state.push(createTable(action.payload));
    },
    join: (state, action) => {
      state.players.push(action.payload);
    }
  }
});

export default tables.reducer;
