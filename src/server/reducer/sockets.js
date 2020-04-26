import { createSlice } from '@reduxjs/toolkit';

export const sockets = createSlice({
  name: 'sockets',
  initialState: [],
  reducers: {
    newConnection: (state, { payload }) => {
      state.push(payload);
    }
  }
});

export const { newConnection } = sockets.actions;

export default sockets.reducer;
