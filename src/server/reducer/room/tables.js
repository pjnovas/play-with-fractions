import { createSlice } from '@reduxjs/toolkit';

const Status = {
  WaitingPlayers: 'WAITING_PLAYERS',
  WaitingPicks: 'WAITING_PICKS',
  Ended: 'ENDED'
};

const createTable = ({ waitFor = 3 } = {}) => ({
  id: 'XYZ', // generate id
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
  name: 'tables',
  initialState: [createTable()],
  reducers: {}
});

export default tables.reducer;
