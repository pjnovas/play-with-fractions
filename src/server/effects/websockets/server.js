import WebSocket from 'ws';
import { take, fork, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import shortid from 'shortid';

import socketEffects from './socket';

import { newConnection } from '../../reducer/sockets';

const ServerActions = {
  NewConnection: '@server/NEW_CONNECTION',
  UnexpectedNewConnection: '@server/ERR_NEW_CONNECTION'
};

const port = process.env.WSS_PORT;
const adminToken = process.env.ADMIN_TOKEN;
const qsToken = process.env.REACT_APP_QS_TOKEN;
const qsRoomId = process.env.REACT_APP_QS_ROOM;

const createWebSocketServer = () => new WebSocket.Server({ port });

const createWebServerChannel = server =>
  eventChannel(emit => {
    server.on('connection', (ws, req) => {
      const data = {};
      const searchParams = new URLSearchParams(req.url.replace('/', ''));

      const token = searchParams.get(qsToken);
      if (token === adminToken) {
        data.isAdmin = true;
      }

      data.roomId = searchParams.get(qsRoomId);

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
  yield fork(serverListener, server);
  yield fork(broadcaster, server);
}
