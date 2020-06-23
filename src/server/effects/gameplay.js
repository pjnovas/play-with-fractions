import { noop, shuffle, times, drop, take as arrayTake } from 'lodash';
import { prop, pick, pipe, reduce, orderBy } from 'lodash/fp';
import {
  all,
  takeLeading,
  takeEvery,
  select,
  put,
  delay,
  call
} from 'redux-saga/effects';

import {
  start,
  create,
  replace,
  deal,
  pick as pickCard,
  tick,
  round,
  ended,
  getPlayersBySocketIds,
  getTablesBySocketIds,
  Status
} from 'app/reducer/room/tables';

import * as tableClient from 'app/reducer/room/table';
import * as ranking from 'app/reducer/room/ranking';
import { getTablesConfig } from 'app/utils/room';

const ONE_SEC = 1000;
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
  const { status, winCard, cards, timeout } = allTables;

  yield put({
    type: 'WS:BROADCAST:ADMINS',
    payload: replace(allTables)
  });

  yield all(
    allTables.tables.map(({ id, players, points }) =>
      put({
        type: 'WS:BROADCAST:TABLE',
        meta: { id },
        payload: tableClient.replace({
          id,
          status,
          players,
          points,
          pick: status === Status.WaitingPicks ? '' : noop(),
          winCard,
          cards,
          timeout
        })
      })
    )
  );
};

const notifyTick = function* () {
  const allTables = yield select(prop('room.tables'));

  yield put({
    type: 'WS:BROADCAST:ADMINS',
    payload: replace({ timeout: allTables.timeout })
  });

  yield all(
    allTables.tables.map(({ id }) =>
      put({
        type: 'WS:BROADCAST:TABLE',
        meta: { id },
        payload: tableClient.replace({
          timeout: allTables.timeout
        })
      })
    )
  );
};

const notifyGameEnd = function* () {
  const allTables = yield select(prop('room.tables'));

  yield put({
    type: 'WS:BROADCAST:ADMINS',
    payload: ended()
  });

  yield all(
    allTables.tables.map(({ id }) =>
      put({
        type: 'WS:BROADCAST:TABLE',
        meta: { id },
        payload: tableClient.ended()
      })
    )
  );

  yield call(buildRanking);
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

const notifyAndWait = function* () {
  yield call(notifyGamePlay);

  while ((yield select(prop('room.tables.timeout'))) > 0) {
    yield delay(ONE_SEC);
    yield put(tick());
    yield call(notifyTick);
  }
};

const startGame = function* () {
  const {
    cards,
    maxPlayers,
    maxPerTable,
    cardsPerRound,
    waitTimeout,
    roundTimeout
  } = yield select(prop('room.settings'));

  const players = yield select(prop('room.players'));

  yield put(
    create({
      waitTimeout: waitTimeout * ONE_SEC,
      roundTimeout: roundTimeout * ONE_SEC,
      deck: shuffle(cards),
      tables: getTables(players, { maxPlayers, maxPerTable }),
      status: Status.Started
    })
  );

  yield* notifyAndWait();

  while ((yield select(prop('room.tables.deck'))).length > 0) {
    yield put(deal(cardsPerRound));
    yield* notifyAndWait();

    const winCard = yield call(getWinCard);
    yield put(round(winCard));
    yield* notifyAndWait();
  }

  yield put(ended());
  yield call(notifyGameEnd);
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

const buildRanking = function* () {
  const { id } = yield select(prop('room.settings'));
  const tables = yield select(prop('room.tables.tables'));

  const rank = pipe(
    reduce(
      (all, { players, points }) => [
        ...all,
        ...players.map(({ email, nickname }) => ({
          nickname,
          points: points[email]
        }))
      ],
      []
    ),
    orderBy(['points', 'nickname'], ['desc', 'asc']),
    reduce(
      (rec, { nickname, points }) => {
        const position = points < rec.points ? rec.position + 1 : rec.position;
        return {
          list: [...rec.list, { nickname, points, position }],
          points,
          position
        };
      },
      { list: [], position: 0, points: Number.MAX_SAFE_INTEGER }
    ),
    prop('list')
  )(tables);

  const rankAction = ranking.replace(rank);

  yield put(rankAction);

  yield put({
    type: 'WS:BROADCAST:ROOM',
    meta: { roomId: id },
    payload: rankAction
  });
};

export default function* () {
  yield all([
    takeLeading(start.type, startGame),
    takeEvery(tableClient.pick.type, playersPick)
    // TODO: allow to cancel current game
  ]);
}
