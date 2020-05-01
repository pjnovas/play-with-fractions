import { shuffle, times, drop, arrayTake } from 'lodash';
import { prop, pick } from 'lodash/fp';
import { all, takeEvery, select, put, delay } from 'redux-saga/effects';

// import * as rooms from 'app/reducer/room/settings';
// import * as players from 'app/reducer/room/players';
import { start, create, replace, deal } from 'app/reducer/room/tables';
import tableClient from 'app/reducer/room/table';
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

  // Notifiers - (move to notifier) --------------------------------------

  const allTables = yield select(prop('room.tables'));

  // notify admins
  yield put({
    type: 'WS:BROADCAST:ADMINS',
    payload: replace(allTables)
  });

  // notify players
  const timeout = 5000; // startup time

  yield all(
    allTables.map(({ id, players, status, points, cards }) =>
      put({
        type: 'WS:BROADCAST:TABLE',
        meta: { id },
        payload: tableClient.replace({
          id,
          players,
          cards,
          points,
          pick: '',
          timeout
        })
      })
    )
  );

  yield delay(timeout);

  // yield put(deal(cardsPerRound)); // deal first round
  // yield delay(roundTimeout);
};

export default function* () {
  yield all([takeEvery(start.type, startGame)]);
}
