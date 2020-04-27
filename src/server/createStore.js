import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from './logger';

import reducer from 'server/reducer';
import effects from 'server/effects';

const sagaMiddleware = createSagaMiddleware();

const middleware = [
  ...getDefaultMiddleware({ thunk: false }),
  sagaMiddleware,
  logger
];

export default () => {
  const store = configureStore({
    devTools: false,
    middleware,
    reducer
  });

  sagaMiddleware.run(effects);
  return store;
};
