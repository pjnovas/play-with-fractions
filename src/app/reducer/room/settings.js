import { createSlice } from '@reduxjs/toolkit';
import shortid from 'shortid';

const initialState = {
  id: null,
  name: '',
  cards: [],
  maxPlayers: 20,
  maxPerTable: 4,
  waitTimeout: 5,
  roundTimeout: 15,
  cardsPerRound: 3
};

export const settings = createSlice({
  name: 'room/settings',
  initialState,
  reducers: {
    create: (state, { payload }) => ({
      id: shortid.generate(),
      ...payload
    }),
    replace: (state, { payload }) => payload,
    fetch: state => ({ ...state, notFound: false }),
    notFound: state => ({
      ...initialState,
      notFound: true
    })
  }
});

export const { create, replace, fetch, notFound } = settings.actions;

export default settings.reducer;
