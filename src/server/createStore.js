import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import reducer from './reducer';
import effects from './effects';

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
