import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import counter from '../features/counter/counterSlice';

// import reducer from './reducer';
import effects from './effects';

const sagaMiddleware = createSagaMiddleware();

const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

export default () => {
  const store = configureStore({
    devTools: true,
    middleware,
    reducer: {
      counter
    }
  });

  sagaMiddleware.run(effects);
  return store;
};
