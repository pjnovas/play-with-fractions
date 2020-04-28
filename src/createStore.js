import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createRouter } from '@respond-framework/rudy';

import reducer from './reducer';
import routes from './routes';
import effects from './effects';

const sagaMiddleware = createSagaMiddleware();

export default () => {
  const {
    middleware: routerMiddleware,
    reducer: location,
    firstRoute
  } = createRouter(routes);

  const middleware = [
    ...getDefaultMiddleware({
      serializableCheck: false,
      thunk: false
    }),
    routerMiddleware,
    sagaMiddleware
  ];

  const store = configureStore({
    devTools: true,
    middleware,
    reducer: {
      ...reducer,
      location
    }
  });

  sagaMiddleware.run(effects);

  return { store, firstRoute };
};
