import { prop } from 'lodash/fp';
import { all, takeEvery, select, put } from 'redux-saga/effects';

import { create } from '../../app/reducer/room/settings';
import { join } from '../../app/reducer/room/players';

const createRoom = function* () {
  const type = create.type;
  const room = yield select(prop('room.settings'));

  yield put({
    type: 'WS:BROADCAST:ADMINS',
    payload: {
      type,
      payload: room
    }
  });
};

const joinPlayer = function* (action) {};

export default function* () {
  yield all([
    takeEvery(join.type, joinPlayer),
    takeEvery(create.type, createRoom)
  ]);
}
