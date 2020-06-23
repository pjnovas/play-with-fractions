import { prop } from 'lodash/fp';
import { all, takeEvery, select, put, call } from 'redux-saga/effects';

import {
  newConnection,
  removeClient,
  replace,
  setRoomId
} from 'app/reducer/sockets';
import * as rooms from 'app/reducer/room/settings';
import * as players from 'app/reducer/room/players';
import * as tables from 'app/reducer/room/tables';
import * as tableClient from 'app/reducer/room/table';
import * as ranking from 'app/reducer/room/ranking';

const createRoom = function* (action) {
  const room = yield select(prop('room.settings'));

  // update current admin with roomId
  yield put(
    setRoomId({
      sid: action.meta.sid,
      roomId: room.id
    })
  );

  yield put({
    type: 'WS:BROADCAST:ADMINS',
    payload: rooms.replace(room)
  });
};

const sendCurrentRoomData = function* ({ meta }) {
  const type = `WS:SEND:${meta.sid}`;

  const sockets = yield select(prop('sockets'));
  const settings = yield select(prop('room.settings'));
  const playerList = yield select(prop('room.players'));
  const tableList = yield select(prop('room.tables'));

  yield put({ type, payload: rooms.replace(settings) });
  yield put({ type, payload: replace(sockets) });
  yield put({ type, payload: players.replace(playerList) });
  yield put({ type, payload: tables.replace(tableList) });
};

const sendCurrentPlayerData = function* ({ meta }) {
  const type = `WS:SEND:${meta.sid}`;

  const allTables = yield select(prop('room.tables'));
  const { status, winCard, cards, timeout } = allTables;

  const tablesBySID = yield select(tables.getTablesBySocketIds);
  const table = tablesBySID[meta.sid];

  if (table) {
    const { id: tableId, players, points } = table;

    yield put({
      type,
      payload: tableClient.replace({
        id: tableId,
        players,
        points,
        status,
        winCard,
        cards,
        timeout
      })
    });
  }
};

const resolveConn = function* (action) {
  const { payload } = action;
  const room = yield select(prop('room.settings'));
  const type = `WS:SEND:${payload.id}`;

  if (room.id !== payload.roomId) {
    yield put({ type, payload: rooms.notFound() });
    return;
  }

  const rank = yield select(prop('room.ranking'));
  yield put({ type, payload: ranking.replace(rank) });

  if (payload.isAdmin && payload.roomId) {
    yield call(sendCurrentRoomData, { meta: { sid: payload.id } });
  }
};

const onRemoveClient = function* (action) {
  yield put(players.disconnect(action.payload));
};

export default function* () {
  yield all([
    takeEvery(rooms.create.type, createRoom),
    takeEvery(newConnection.type, resolveConn),
    takeEvery(removeClient.type, onRemoveClient),
    takeEvery(rooms.fetch.type, sendCurrentRoomData),
    takeEvery(players.join.type, sendCurrentPlayerData)
  ]);
}
