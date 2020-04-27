import { createSlice } from '@reduxjs/toolkit';

export const players = createSlice({
  name: 'room/players',
  initialState: [
    // nickname: '',
    // email: '',              // check for @[something-expected] (UNIQUE ID)
    // fingerprint: '',        // browsers fingerprint
    // status: ''              // CONNECTED, DISCONNECTED
  ],
  reducers: {
    join: (state, action) => {
      state.push(action.payload);
    }
  }
});

export const { join } = players.actions;

export default players.reducer;
