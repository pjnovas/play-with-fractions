import WebSocket from 'ws';
import { take, fork, put, call, select } from 'redux-saga/effects';

import {
  newConnection,
  getTableIds,
  getRoomIds,
  getAdminIds
} from '../../reducer/sockets';

import socketEffects from './socket';
import createWebServerChannel from './serverChannel';
import ServerActions from './actionTypes';

const port = process.env.WSS_PORT;

// TODO: create an http server and set up an authorization at handshake
const createWebSocketServer = () => new WebSocket.Server({ port });

const broadcastToIds = (server, ids, action) => {
  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && ids.includes(client.id)) {
      server.send(JSON.stringify(action));
    }
  });
};

const roomBroadcaster = function* (server) {
  while (true) {
    const { meta, payload } = yield take('BROADCAST:ROOM');
    const ids = yield select(getRoomIds(meta.roomId));
    broadcastToIds(server, ids, payload);
  }
};

const tableBroadcaster = function* (server) {
  while (true) {
    const { meta, payload } = yield take('BROADCAST:TABLE');
    const ids = yield select(getTableIds(meta.tableId));
    broadcastToIds(server, ids, payload);
  }
};

const adminBroadcaster = function* (server) {
  while (true) {
    const { payload } = yield take('BROADCAST:ADMINS');
    const ids = yield select(getAdminIds);
    broadcastToIds(server, ids, payload);
  }
};

const broadcaster = function* (server) {
  yield fork(roomBroadcaster, server);
  yield fork(tableBroadcaster, server);
  yield fork(adminBroadcaster, server);
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
