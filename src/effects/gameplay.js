import { put, takeEvery, select, all } from 'redux-saga/effects';
import { prop } from 'lodash/fp';

import { replace } from 'app/reducer/room/table';
import { setLoading } from 'reducer/player';

const onGameStart = function* () {
  const loading = yield select(prop('player.loading'));
  const cards = yield select(prop('table.cards'));

  if (loading && cards.length > 0) {
    yield put(setLoading(false));
  }
};

export default function* () {
  yield all([takeEvery(replace.type, onGameStart)]);
}
