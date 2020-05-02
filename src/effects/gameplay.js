import { put, call, select, take, takeEvery, all } from 'redux-saga/effects';
import { prop } from 'lodash/fp';

import { replace } from 'app/reducer/room/table';
import { setLoading } from 'reducer/player';

const onGameStart = function* (action) {
  console.log('onGameStart');
  yield put(setLoading(false));

  // Starting ...
};

export default function* () {
  yield all([takeEvery(replace.type, onGameStart)]);
}
