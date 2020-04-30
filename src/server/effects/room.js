import { prop } from 'lodash/fp';
import { all, takeEvery, select, put, call } from 'redux-saga/effects';

import { newConnection, removeClient, replace } from 'app/reducer/sockets';
import * as rooms from 'app/reducer/room/settings';
import * as players from 'app/reducer/room/players';

const createRoom = function* () {
  const room = yield select(prop('room.settings'));

  yield put({
    type: 'WS:BROADCAST:ADMINS',
    payload: rooms.replace(room)
  });
};

const sendCurrentRoomData = function* ({ meta }) {
  const type = `WS:SEND:${meta.sid}`;

  const sockets = yield select(prop('sockets'));
  const settings = yield select(prop('room.settings'));
  const playerList = yield select(prop('room.players'));

  yield put({ type, payload: rooms.replace(settings) });
  yield put({ type, payload: replace(sockets) });
  yield put({ type, payload: players.replace(playerList) });
};

const resolveConn = function* (action) {
  const { payload } = action;
  const room = yield select(prop('room.settings'));
  const type = `WS:SEND:${payload.id}`;

  if (room.id !== payload.roomId) {
    yield put({ type, payload: rooms.notFound() });
    return;
  }

  if (payload.isAdmin && payload.roomId) {
    yield call(sendCurrentRoomData, { meta: { sid: payload.id } });
  }

  // TODO: else: player joined!
};

const onRemoveClient = function* (action) {
  yield put(players.disconnect(action.payload));
};

export default function* () {
  yield all([
    takeEvery(rooms.create.type, createRoom),
    takeEvery(newConnection.type, resolveConn),
    takeEvery(removeClient.type, onRemoveClient),
    takeEvery(rooms.fetch.type, sendCurrentRoomData)
  ]);
}
