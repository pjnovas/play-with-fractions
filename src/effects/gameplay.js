import { put, takeEvery, select, all } from 'redux-saga/effects';
import { prop } from 'lodash/fp';

import { types as Routes } from 'routes';
import { replace } from 'app/reducer/room/table';
import { replace as newRanking } from 'app/reducer/room/ranking';
import { setLoading } from 'reducer/player';
import { isClientAdmin } from 'reducer/websocket';

const onGameStart = function* () {
  // TODO: if is at ranking > redirect to gameplay

  const loading = yield select(prop('player.loading'));
  const cards = yield select(prop('table.cards'));

  if (loading && cards.length > 0) {
    yield put(setLoading(false));
  }
};

const onRanking = function* () {
  const isAdmin = yield select(isClientAdmin);
  const roomId = yield select(prop('location.params.roomId'));

  if (!isAdmin && roomId) {
    yield put({ type: Routes.RANKING, params: { roomId } });
  }
};

export default function* () {
  yield all([
    takeEvery(replace.type, onGameStart),
    takeEvery(newRanking.type, onRanking)
  ]);
}
