import {
  fork,
  take,
  put,
  call,
  select,
  takeEvery,
  all
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { prop } from 'lodash/fp';

import { connect, setStatus, getWSUrl, isOnline } from 'reducer/websocket';
import { replace } from 'app/reducer/room/settings';
import { types as Routes } from 'routes';

const createWebSocketsChannel = socket =>
  eventChannel(emit => {
    socket.addEventListener('open', event => {
      emit(setStatus('OPEN'));
    });

    socket.addEventListener('error', event => {
      emit(setStatus('ERROR'));
      console.error('Websocket error: ', event);
    });

    socket.addEventListener('close', event => {
      emit(setStatus('CLOSED'));
    });

    socket.addEventListener('message', event => {
      emit(JSON.parse(event.data));
    });

    return socket.close;
  });

const listener = function* (socket) {
  const channel = yield call(createWebSocketsChannel, socket);

  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
};

const sender = function* (socket) {
  while (true) {
    const { payload } = yield take('WS:SEND');
    socket.send(JSON.stringify(payload));
  }
};

const handleIO = function* (socket) {
  yield fork(listener, socket);
  yield fork(sender, socket);
};

const connectWS = function* () {
  if (yield select(isOnline)) return; // already connected

  const wsURL = yield select(getWSUrl);
  yield fork(handleIO, new WebSocket(wsURL));
};

const onOpenRoomAdmin = function* (action) {
  if (!(yield select(isOnline))) {
    yield fork(connectWS);
    yield take(setStatus('OPEN').type);
  }

  console.log('onOpenRoomAdmin: ready for getting the room');
  // TODO: room is already since it's replied from connection
};

const onEnterPlay = function* (action) {
  yield call(connectWS);
  yield take(setStatus('OPEN'));

  // TODO: start game
};

const onNewRoom = function* (action) {
  const roomId = action.payload.id;
  if (!roomId) return; // maybe a clean up

  const page = yield select(prop('location.type'));
  const token = yield select(prop('location.params.token'));

  if (page === Routes.ADMIN) {
    yield put({ type: Routes.ADMIN_ROOM, params: { token, roomId } });
  }
};

export default function* () {
  yield all([
    takeEvery(connect.type, connectWS),
    takeEvery(Routes.ADMIN, connectWS),
    takeEvery(Routes.ADMIN_ROOM, onOpenRoomAdmin),
    takeEvery(Routes.PLAY, onEnterPlay),
    takeEvery(replace.type, onNewRoom)
  ]);
}
