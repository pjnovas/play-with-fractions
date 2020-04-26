import WebSocket from 'ws';
import { take, fork, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import shortid from 'shortid';

import { newConnection } from '../reducer/sockets';
import { setPlayers } from '../reducer/room/settings';

const ServerActions = {
  NewConnection: '@server/NEW_CONNECTION',
  UnexpectedNewConnection: '@server/ERR_NEW_CONNECTION'
};

const adminToken = '123456789';

const createWebSocketServer = () => new WebSocket.Server({ port: 8080 });

const createWebServerChannel = server =>
  eventChannel(emit => {
    server.on('connection', (ws, req) => {
      const data = {};
      const searchParams = new URLSearchParams(req.url.replace('/', ''));

      const token = searchParams.get('token');
      if (token === adminToken) {
        data.isAdmin = true;
      }

      data.roomId = searchParams.get('rid');

      if (!data.isAdmin && !data.roomId) {
        ws.send(JSON.stringify({ error: '401 Unauthorized' }));
        ws.close();
        return;
      }

      ws.id = shortid.generate();
      emit({ type: ServerActions.NewConnection, payload: { ws, ...data } });
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
      console.log('CLOSE SOCKET', socket.id);
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

      switch (type) {
        case ServerActions.NewConnection: {
          const { ws, ...data } = payload;
          yield put(newConnection({ id: ws.id, ...data }));
          break;
        }
        default:
          return yield put({
            type: ServerActions.UnexpectedNewConnection,
            error: true,
            payload: 'Unexpected Connection'
          });
      }

      yield fork(socketListener, payload.ws);
      yield fork(socketSender, payload.ws);

      // should cancel later on
    } catch (e) {
      console.log('Websocket Err: ', e);
    }
  }
};

export default function* () {
  const server = yield call(createWebSocketServer);
  yield put(setPlayers(5));
  yield fork(serverListener, server);
  yield fork(broadcaster, server);
}