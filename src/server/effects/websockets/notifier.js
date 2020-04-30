import { put, all, takeEvery } from 'redux-saga/effects';
import { newConnection, removeClient } from 'app/reducer/sockets';
import { join, disconnect } from 'app/reducer/room/players';

const notifyAdmins = function* (action) {
  // Notify admins
  yield put({
    type: 'WS:BROADCAST:ADMINS',
    payload: action
  });
};

export default function* () {
  yield all([
    takeEvery(newConnection.type, notifyAdmins),
    takeEvery(removeClient.type, notifyAdmins),
    takeEvery(join.type, notifyAdmins),
    takeEvery(disconnect.type, notifyAdmins)
  ]);
}
