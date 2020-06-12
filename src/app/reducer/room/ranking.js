import { createSlice } from '@reduxjs/toolkit';

export const ranking = createSlice({
  name: 'room/ranking',
  initialState: [],
  reducers: {
    replace: (state, { payload }) => payload
  }
});

export const { replace } = ranking.actions;

export default ranking.reducer;
