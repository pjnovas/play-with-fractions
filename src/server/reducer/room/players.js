import { createSlice } from '@reduxjs/toolkit';

export const players = createSlice({
  name: 'players',
  initialState: [
    // nickname: '',
    // email: '',              // check for @[something-expected] (UNIQUE ID)
    // fingerprint: '',        // browsers fingerprint
    // status: ''              // CONNECTED, DISCONNECTED
  ],
  reducers: {}
});

export default players.reducer;
