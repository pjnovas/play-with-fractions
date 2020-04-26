import util from 'util';
import WebSocket from 'ws';
import { take, fork, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

const createWebSocketServer = () => new WebSocket.Server({ port: 8080 });

const createWebServerChannel = server =>
  eventChannel(emit => {
    server.on('connection', payload => {
      console.log(util.inspect(payload, false, null, true));
      emit({ type: 'NEW_CONNECTION', payload });
    });

    return () => {
      console.log('CLOSE SERVER');
    };
  });

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
      console.log('CLOSE SOCKET');
    };
  });

const broadcaster = function* (server) {
  while (true) {
    const action = yield take(`BROADCAST`);
    server.send(JSON.stringify(action));
  }
};

const socketSender = function* (socket) {
  while (true) {
    // TODO: implement ROOMs and SocketIDs
    const action = yield take(`SEND:${socket.id}`);
    socket.send(JSON.stringify(action));
  }
};

const socketListener = function* (socket) {
  const channel = yield call(createWebSocketsChannel, socket);

  while (true) {
    try {
      const action = yield take(channel);
      // TODO: translate action
      yield put(action);
    } catch (e) {
      console.log('Websocket Err: ', e);
    }
  }
};

const serverListener = function* (server) {
  const channel = yield call(createWebServerChannel, server);

  while (true) {
    try {
      const { type, payload } = yield take(channel);
      yield put({ type });

      yield fork(socketListener, payload);
      yield fork(socketSender, payload);

      // should cancel later on
    } catch (e) {
      console.log('Websocket Err: ', e);
    }
  }
};

export default function* () {
  const server = yield call(createWebSocketServer);
  yield fork(serverListener, server);
  yield fork(broadcaster, server);
}
