import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from './logger';

import reducer from './reducer';
import effects from './effects';

const logs = process.env.LOGGER;

const sagaMiddleware = createSagaMiddleware();

const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

export default () => {
  const store = configureStore({
    devTools: false,
    middleware: logs ? [...middleware, logger] : middleware,
    reducer
  });

  sagaMiddleware.run(effects);
  return store;
};
