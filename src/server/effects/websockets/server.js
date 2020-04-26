import WebSocket from 'ws';
import { take, fork, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import shortid from 'shortid';

import socketEffects from './socket';

import { newConnection } from '../../reducer/sockets';
import { setPlayers } from '../../reducer/room/settings';

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

const broadcaster = function* (server) {
  while (true) {
    const action = yield take(`BROADCAST`);
    server.send(JSON.stringify(action));
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

      yield fork(socketEffects, payload.ws);

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
