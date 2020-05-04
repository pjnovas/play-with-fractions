import { put, fork, takeEvery, select, all, delay } from 'redux-saga/effects';
import { prop } from 'lodash/fp';
import { replace, tick } from 'app/reducer/room/table';
import { setLoading } from 'reducer/player';

const clockTick = function* () {
  while (true) {
    yield delay(1000);

    const timeout = yield select(prop('table.timeout'));
    if (timeout > 0) {
      yield put(tick());
    }
  }
};

const onGameStart = function* (action) {
  yield put(setLoading(false));
};

export default function* () {
  yield all([takeEvery(replace.type, onGameStart)]);
  yield fork(clockTick);
}
