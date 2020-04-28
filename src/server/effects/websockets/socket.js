import { select, take, fork, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { getAdminIds } from 'server/reducer/sockets';

import { create } from 'app/reducer/room/settings';
const adminActions = [create.type];

const createWebSocketsChannel = socket =>
  eventChannel(emit => {
    socket.on('message', message => {
      try {
        emit(JSON.parse(message));
      } catch (e) {
        console.log('Error when parsing a message as action', e);
      }
    });

    return () => {
      console.log('CLOSE SOCKET', socket.id);
      socket.close();
    };
  });

const socketSender = function* (socket) {
  while (true) {
    const action = yield take(`WS:SEND:${socket.id}`);
    socket.send(JSON.stringify(action.payload));
  }
};

const socketListener = function* (socket) {
  const channel = yield call(createWebSocketsChannel, socket);

  while (true) {
    try {
      const action = yield take(channel);

      if (adminActions.includes(action.type)) {
        const adminIds = yield select(getAdminIds);
        if (!adminIds.includes(socket.id)) {
          console.log('DISALLOWED ACTION', action);
          return; // DISALLOWED
        }
      }

      yield put(action);
    } catch (e) {
      console.log('Websocket Err: ', e);
    }
  }
};

export default function* (socket) {
  yield fork(socketListener, socket);
  yield fork(socketSender, socket);
}
