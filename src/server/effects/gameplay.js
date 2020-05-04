import { noop, shuffle, times, drop, take as arrayTake } from 'lodash';
import { prop, pick } from 'lodash/fp';
import { all, takeEvery, select, put, delay, call } from 'redux-saga/effects';

import {
  start,
  create,
  replace,
  deal,
  pick as pickCard,
  round,
  ended,
  getPlayersBySocketIds,
  getTablesBySocketIds,
  Status
} from 'app/reducer/room/tables';

import * as tableClient from 'app/reducer/room/table';
import { getTablesConfig } from 'app/utils/room';

const playerFields = ['email', 'nickname'];

const getTables = (players, { maxPlayers, maxPerTable }) => {
  let pls = [...players];
  const config = getTablesConfig(maxPlayers, maxPerTable);

  const tables = times(config.tables, () => {
    const players = arrayTake(pls, maxPerTable).map(pick(playerFields));
    pls = drop(pls, maxPerTable);
    return { players };
  });

  if (config.plus) {
    tables.push({ players: pls.map(pick(playerFields)) });
  }

  return tables;
};

const notifyGamePlay = function* () {
  const allTables = yield select(prop('room.tables'));

  yield put({
    type: 'WS:BROADCAST:ADMINS',
    payload: replace(allTables)
  });

  yield all(
    allTables.tables.map(({ id, players, status, points }) =>
      put({
        type: 'WS:BROADCAST:TABLE',
        meta: { id },
        payload: tableClient.replace({
          id,
          players,
          points,
          pick: allTables.status === Status.WaitingPicks ? '' : noop(),
          winCard: allTables.winCard,
          cards: allTables.cards,
          timeout: allTables.timeout
        })
      })
    )
  );
};

const getWinCard = function* () {
  const cards = yield select(prop('room.tables.cards'));

  const getCardNumber = card =>
    card.includes('/')
      ? Number(card.split('/')[0]) / Number(card.split('/')[1])
      : Number(card);

  return cards.reduce(
    (max, card) => (getCardNumber(max) > getCardNumber(card) ? max : card),
    '0'
  );
};

const startGame = function* () {
  const { cards, maxPlayers, maxPerTable, cardsPerRound } = yield select(
    prop('room.settings')
  );

  const players = yield select(prop('room.players'));

  yield put(
    create({
      deck: shuffle(cards),
      tables: getTables(players, { maxPlayers, maxPerTable })
    })
  );

  while ((yield select(prop('room.tables.deck'))).length > 0) {
    yield call(notifyGamePlay);
    yield delay(yield select(prop('room.tables.timeout')));

    yield put(deal(cardsPerRound));
    yield call(notifyGamePlay);
    yield delay(yield select(prop('room.tables.timeout')));

    const winCard = yield call(getWinCard);
    yield put(round(winCard));
  }

  yield delay(yield select(prop('room.tables.timeout')));
  yield put(ended());
};

const playersPick = function* ({ meta, payload }) {
  const socketId = meta.sid;

  const players = yield select(getPlayersBySocketIds);
  const tables = yield select(getTablesBySocketIds);

  if (!tables[socketId]) {
    console.log('Table ID not found with SID ', socketId);
    return;
  }

  const id = tables[socketId].id;

  const playerPick = pickCard({
    id,
    player: players[socketId].email,
    pick: payload
  });

  yield put(playerPick);

  yield put({
    type: 'WS:BROADCAST:ADMINS',
    payload: playerPick
  });

  yield call(notifyPlayerPick, id);
};

const notifyPlayerPick = function* (id) {
  const roomTable = yield select(prop('room.tables'));
  const table = roomTable.tables.find(table => table.id === id);

  if (!table) {
    console.log('Table not found for ID ', id);
    return;
  }

  yield put({
    type: 'WS:BROADCAST:TABLE',
    meta: { id },
    payload: tableClient.replace({
      players: table.players
    })
  });
};

export default function* () {
  yield all([takeEvery(start.type, startGame)]);
  yield all([takeEvery(tableClient.pick.type, playersPick)]);
}
