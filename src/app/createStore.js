import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

// TODO: react features here
// import counter from '../features/counter/counterSlice';

import reducer from 'app/reducer';
import effects from 'app/effects';

const sagaMiddleware = createSagaMiddleware();

const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

export default () => {
  const store = configureStore({
    devTools: true,
    middleware,
    reducer
  });

  sagaMiddleware.run(effects);
  return store;
};
