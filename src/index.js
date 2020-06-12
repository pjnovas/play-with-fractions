import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'features/app';
import createStore from './createStore';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

// import preload from './tmp/ranking_from_player.json';
const preload = {};

const { store, firstRoute } = createStore(preload);

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
