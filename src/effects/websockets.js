import {
  fork,
  take,
  put,
  call,
  select,
  takeEvery,
  all,
  delay
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { pick } from 'lodash';
import { prop } from 'lodash/fp';

import {
  setOpen,
  setClosed,
  setError,
  getWSUrl,
  isOnline
} from 'reducer/websocket';

import { replace, fetch, notFound } from 'app/reducer/room/settings';
import { join } from 'app/reducer/room/players';
import { setLoading, setData } from 'reducer/player';
import { types as Routes } from 'routes';

const allowLocalAuth = !!process.env.REACT_APP_ALLOW_LOCAL_AUTH;
// const pingTime = process.env.REACT_APP_PING_TIME || 30000;
// const latency = process.env.REACT_APP_LATENCY || 1000;

const createWebSocketsChannel = socket =>
  eventChannel(emit => {
    // const heartbeat = function () {
    //   clearTimeout(this.pingTimeout);
    //   this.pingTimeout = setTimeout(() => {
    //     // this.terminate();
    //     console.log('terminate me!');
    //   }, pingTime + latency);
    // };

    const onOpen = () => {
      // heartbeat();
      emit(setOpen());
    };

    const onClose = event => {
      // clearTimeout(this.pingTimeout);
      emit(setClosed());
    };

    const onError = event => {
      emit(setError());
      console.error('Websocket error: ', event);
    };

    const onMessage = event => {
      emit(JSON.parse(event.data));
    };

    socket.addEventListener('open', onOpen);
    socket.addEventListener('error', onError);
    socket.addEventListener('close', onClose);
    socket.addEventListener('message', onMessage);

    // socket.addEventListener('ping', heartbeat);

    return () => {
      try {
        socket.removeEventListener('open', onOpen);
        socket.removeEventListener('error', onError);
        socket.removeEventListener('close', onClose);
        socket.removeEventListener('message', onMessage);
        socket.close();
      } catch (e) {}
    };
  });

const listener = function* (socket) {
  const channel = yield call(createWebSocketsChannel, socket);

  while (true) {
    const action = yield take(channel);
    yield put(action);

    if ([setClosed.type, setError.type].includes(action.type)) {
      channel.close();
    }
  }
};

const sender = function* (socket) {
  while (true) {
    const { payload } = yield take('WS:SEND');
    socket.send(JSON.stringify(payload));
  }
};

const handleIO = function* (socket) {
  yield fork(listener, socket);
  yield fork(sender, socket);
};

const connectWS = function* () {
  if (yield select(isOnline)) {
    // if is already online > skip it
    return;
  }

  while (true) {
    const wsURL = yield select(getWSUrl);
    const task = yield fork(handleIO, new WebSocket(wsURL));

    const action = yield take([setClosed.type, setError.type, setOpen.type]);

    if (action.type === setOpen.type) {
      // connected! - wait for a failure
      yield take([setClosed.type, setError.type]);
    } else {
      // wait 3 seconds and try again
      yield delay(3000);
    }

    task.cancel();
  }
};

const reloadCurrent = function* (action) {
  const currentPage = yield select(prop('location.type'));

  // eslint-disable-next-line default-case
  switch (currentPage) {
    case Routes.ADMIN: {
      // TODO: get latest creation from local storage
      break;
    }
    case Routes.ADMIN_ROOM: {
      yield put({
        type: 'WS:SEND',
        payload: fetch()
      });

      yield take(replace.type); // wait for room
      break;
    }
    case Routes.RANKING: {
      // TODO: fetch ranking
      break;
    }
    case Routes.PLAY: {
      if (allowLocalAuth) {
        try {
          const roomId = yield select(prop('location.params.roomId'));
          let data = JSON.parse(window.localStorage.getItem('player'));

          if (data.roomId === roomId) {
            const player = pick(data, ['nickname', 'email']);

            yield put({
              type: 'WS:SEND',
              payload: join(player)
            });

            yield put(setLoading(true));
            yield put(setData(player));
          }
        } catch (e) {
          window.localStorage.removeItem('player');
        }
      }
      break;
    }
  }
};

const storePlayerInfo = function* (action) {
  const roomId = yield select(prop('location.params.roomId'));
  const { nickname, email } = action.payload;

  window.localStorage.setItem(
    'player',
    JSON.stringify({
      roomId,
      nickname,
      email
    })
  );
};

const onRoomNotFound = function* (action) {
  const roomId = yield select(prop('location.params.roomId'));
  console.log('<< room not found! >>', roomId);
  window.localStorage.removeItem('player');
};

const onNewRoom = function* (action) {
  const roomId = action.payload.id;
  if (!roomId) return; // maybe a clean up

  const page = yield select(prop('location.type'));
  const token = yield select(prop('location.params.token'));

  if (page === Routes.ADMIN) {
    yield put({ type: Routes.ADMIN_ROOM, params: { token, roomId } });
  }
};

export default function* () {
  yield all([
    // When pages that need WS
    takeEvery([Routes.ADMIN, Routes.ADMIN_ROOM, Routes.PLAY], connectWS),

    // When WS Online > reload
    takeEvery(setOpen.type, reloadCurrent),

    // ...
    takeEvery(setData, storePlayerInfo),
    takeEvery(replace.type, onNewRoom),
    takeEvery(notFound.type, onRoomNotFound)
  ]);
}
