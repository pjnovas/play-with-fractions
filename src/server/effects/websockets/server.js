import WebSocket from 'ws';
import { take, fork, put, call } from 'redux-saga/effects';

import { newConnection } from '../../reducer/sockets';

import socketEffects from './socket';
import createWebServerChannel from './serverChannel';
import broadcaster from './broadcaster';
import ServerActions from './actionTypes';

const port = process.env.WSS_PORT;

// TODO: create an http server and set up an authorization at handshake
const createWebSocketServer = () => new WebSocket.Server({ port });

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
