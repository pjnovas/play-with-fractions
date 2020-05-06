import { prop, pipe, isEqual } from 'lodash/fp';
import { createSlice, createSelector } from '@reduxjs/toolkit';

const wsURL = process.env.REACT_APP_WS_URL;
const qsToken = process.env.REACT_APP_QS_TOKEN;
const qsRoomId = process.env.REACT_APP_QS_ROOM;

export const websocket = createSlice({
  name: 'websocket',
  initialState: {
    status: null
  },
  reducers: {
    setStatus: (state, { payload: status }) => ({ ...state, status }),
    setOpen: state => ({ ...state, status: 'OPEN' }),
    setClosed: state => ({ ...state, status: 'CLOSED' }),
    setError: state => ({ ...state, status: 'ERROR' })
  }
});

export const { setOpen, setClosed, setError } = websocket.actions;

// Selectors

export const getWSUrl = createSelector(
  prop('location.params'),
  ({ token, roomId }) => {
    const url = new URL(wsURL);
    if (token) url.searchParams.set(qsToken, token);
    if (roomId) url.searchParams.set(qsRoomId, roomId);
    return url.toString();
  }
);

export const isOnline = pipe(prop(`${websocket.name}.status`), isEqual('OPEN'));

export default websocket.reducer;
