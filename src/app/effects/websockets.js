import { fork, take, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

const wsURL = 'ws://localhost:8080';

const setStatus = payload => ({ type: 'SET_STATUS', payload });
const setMessage = payload => ({ type: 'SET_MESSAGE', payload });

const createWebSocketConnection = () => new WebSocket(wsURL);

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
      emit(setMessage(JSON.parse(event.data)));
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
    const { payload } = yield take('WS-SEND');
    socket.send(JSON.stringify(payload));
  }
};

const handleIO = function* (socket) {
  yield fork(listener, socket);
  yield fork(sender, socket);
};

export default function* () {
  const socket = yield call(createWebSocketConnection);
  yield fork(handleIO, socket);
}
