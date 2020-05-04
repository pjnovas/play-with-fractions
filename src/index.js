import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'features/app';
import createStore from './createStore';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

const test = {
  room: {
    settings: {
      id: null,
      name: '',
      cards: [],
      maxPlayers: 20,
      maxPerTable: 4,
      cardsPerRound: 3
    },
    players: [],
    ranking: [],
    tables: {
      status: 'WAITING_PLAYERS',
      deck: [],
      cards: [],
      tables: []
    }
  },
  sockets: [],
  player: {
    nickname: 'user1',
    email: 'user1@gmail.com',
    loading: false
  },
  page: 'Play',
  websocket: {
    status: 'OPEN'
  },
  table: {
    id: '7xzkkMOu7',
    players: [
      {
        email: 'user1@gmail.com',
        nickname: 'user1'
      },
      {
        email: 'user2@gmail.com',
        nickname: 'user2',
        state: 'win'
      },
      {
        email: 'user3@gmail.com',
        nickname: 'user3'
      }
    ],
    status: 'WAITING_PLAYERS',
    points: {
      'user1@gmail.com': 21,
      'user2@gmail.com': 3,
      'user3@gmail.com': 5
    },
    cards: ['2/3', '1', '1/2'],
    timeout: 5000,
    pick: ''
  },
  location: {
    type: 'PAGE_PLAY',
    params: {
      roomId: 'Jn2qGF22c'
    },
    query: {},
    state: {},
    hash: '',
    basename: '',
    universal: false,
    kind: 'load',
    direction: 'forward',
    n: 1,
    url: '/play/Jn2qGF22c',
    pathname: '/play/Jn2qGF22c',
    search: '',
    key: '8hd7ur',
    scene: '',
    prev: {
      type: '',
      params: {},
      query: {},
      state: {},
      hash: '',
      basename: '',
      location: {
        url: '',
        pathname: '',
        search: '',
        key: '',
        scene: '',
        index: -1
      }
    },
    from: null,
    blocked: null,
    entries: [
      {
        type: 'PAGE_PLAY',
        params: {
          roomId: 'Jn2qGF22c'
        },
        query: {},
        hash: '',
        state: {},
        basename: '',
        location: {
          key: '8hd7ur',
          scene: '',
          url: '/play/Jn2qGF22c',
          pathname: '/play/Jn2qGF22c',
          search: ''
        }
      }
    ],
    index: 0,
    length: 1,
    pop: false,
    status: 200
  }
};

const { store, firstRoute } = createStore(test);

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
};

store.dispatch(firstRoute()).then(() => render());

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
