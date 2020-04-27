import { all, takeEvery } from 'redux-saga/effects';

import { create } from '../../app/reducer/room/settings';
import { join } from '../../app/reducer/room/players';

const createRoom = function* (action) {
  console.log('createRoom!');
  console.log(action);

  // TODO: send back the created room
  // yield select
  // yield put('BROADCAST:ADMINS')
};

const joinPlayer = function* (action) {};

export default function* () {
  yield all([
    takeEvery(join.type, joinPlayer),
    takeEvery(create.type, createRoom)
  ]);
}
