import { prop } from 'lodash/fp';
import { all, takeEvery, select, put } from 'redux-saga/effects';

import { newConnection } from 'server/reducer/sockets';
import * as rooms from 'app/reducer/room/settings';

const createRoom = function* () {
  const room = yield select(prop('room.settings'));

  yield put({
    type: 'WS:BROADCAST:ADMINS',
    payload: rooms.replace(room)
  });
};

const resolveConn = function* ({ payload }) {
  const room = yield select(prop('room.settings'));
  const type = `WS:SEND:${payload.id}`;

  if (room.id !== payload.roomId) {
    yield put({ type, payload: rooms.notFound() });
    return;
  }

  if (payload.isAdmin && payload.roomId) {
    yield put({ type, payload: rooms.replace(room) });
  }

  // TODO: else: player joined!
};

export default function* () {
  yield all([
    takeEvery(rooms.create.type, createRoom),
    takeEvery(newConnection.type, resolveConn)
  ]);
}
