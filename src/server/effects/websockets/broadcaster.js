import WebSocket from 'ws';
import { take, fork, select } from 'redux-saga/effects';
import { getRoomIds, getAdminIds } from 'app/reducer/sockets';
import { getSocketIdsByTableId } from 'app/reducer/room/tables';

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
    const socketsByTableId = yield select(getSocketIdsByTableId);
    broadcastToIds(server, socketsByTableId[meta.id], payload);
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
