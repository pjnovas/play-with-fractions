import { createSlice } from '@reduxjs/toolkit';

// TODO: save this data into localstorage (just for the browser reloads)

export const player = createSlice({
  name: 'player',
  initialState: {
    nickname: '',
    email: '',
    loading: false
  },
  reducers: {
    setLoading: (state, { payload }) => ({ ...state, loading: false }), // TODO: remove this state
    setData: (state, { payload }) => ({ ...state, ...payload })
  }
});

export const { setData, setLoading } = player.actions;

export default player.reducer;
