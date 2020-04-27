import WebSocket from 'ws';
import { take, fork, select } from 'redux-saga/effects';
import { getTableIds, getRoomIds, getAdminIds } from 'server/reducer/sockets';

const broadcastToIds = (server, ids, action) => {
  server.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN && ids.includes(ws.id)) {
      ws.send(JSON.stringify(action));
    }
  });
};

const roomBroadcaster = function* (server) {
  while (true) {
    const { meta, payload } = yield take('WS:BROADCAST:ROOM');
    const ids = yield select(getRoomIds(meta.roomId));
    broadcastToIds(server, ids, payload);
  }
};

const tableBroadcaster = function* (server) {
  while (true) {
    const { meta, payload } = yield take('WS:BROADCAST:TABLE');
    const ids = yield select(getTableIds(meta.tableId));
    broadcastToIds(server, ids, payload);
  }
};

const adminBroadcaster = function* (server) {
  while (true) {
    const { payload } = yield take('WS:BROADCAST:ADMINS');
    const ids = yield select(getAdminIds);
    broadcastToIds(server, ids, payload);
  }
};

export default function* (server) {
  yield fork(roomBroadcaster, server);
  yield fork(tableBroadcaster, server);
  yield fork(adminBroadcaster, server);
}
